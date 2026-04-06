import Papa from 'papaparse';
import MLR from 'ml-regression-multivariate-linear';
import { getUserScopedKey } from './userStorage';

let globalMLRModel = null;
let historicalFeatures = []; // X array
let historicalTargets = [];  // Y array

export const ACTIVITY_MAP = {
  Low: 0,
  Normal: 1,
  High: 2
};

/**
 * Normalizes time string "HH:MM" into decimal hours (e.g. "08:30" -> 8.5)
 */
function parseTimeToDecimal(timeStr) {
    if (!timeStr) return 12.0;
    if (typeof timeStr === 'number') return timeStr;
    const parts = timeStr.split(':');
    if (parts.length < 2) return 12.0;
    return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60.0;
}

/**
 * Initializes and trains the Multivariate Linear Regression model on initial load.
 */
export async function initializeMLModel() {
  try {
    console.log("Loading dataset for ML Regression training...");
    
    // Fetch CSV from public folder
    const response = await fetch('/glucose_dataset.csv');
    const text = await response.text();
    
    // Parse CSV
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    
    const rows = parsed.data;
    
    historicalFeatures = [];
    historicalTargets = [];
    
    // The dataset is recorded in ~2 hour increments.
    // We will train the model to predict the next reading based on current state.
    for (let i = 0; i < rows.length - 1; i++) {
        const curr = rows[i];
        const next = rows[i+1];
        
        const glucose = curr.glucose ?? 100;
        const carbs = curr.carbs ?? 0;
        const insulin = curr.insulin ?? 0;
        const activityStr = curr.activity ?? 'Normal';
        
        let activityCode = 1; // Normal
        if (typeof activityStr === 'string') {
            if (activityStr.toLowerCase() === 'low') activityCode = 0;
            if (activityStr.toLowerCase() === 'high') activityCode = 2;
        }

        // We can extract an approximate hour from the timestamp string (e.g. "2023-10-01 06:00:00")
        let hour = 12.0;
        if (curr.timestamp && typeof curr.timestamp === 'string') {
            const timePart = curr.timestamp.split(' ')[1];
            if (timePart) {
                hour = parseTimeToDecimal(timePart);
            }
        }

        // Feature vector: [current_glucose, carbs_consumed, insulin_taken, activity_level, current_hour]
        historicalFeatures.push([glucose, carbs, insulin, activityCode, hour]);
        
        // Target Vector: [next_glucose]
        const nextGlucose = next.glucose ?? glucose;
        historicalTargets.push([nextGlucose]);
    }
    
    // Base training
    if (historicalFeatures.length > 0) {
        globalMLRModel = new MLR(historicalFeatures, historicalTargets);
        console.log("Multivariate Linear Regression Model Trained Successfully on", historicalFeatures.length, "rows.");
    }
    
    // Also load any personalized history from localStorage
    loadPersonalHistory();
    
    return true;
  } catch (error) {
    console.error("Failed to initialize ML model:", error);
    return false;
  }
}

/**
 * Loads the user's metabolic profile from LocalStorage. 
 * Falls back to default healthy ranges if not onboarded yet.
 */
function getUserProfile() {
    try {
        const raw = localStorage.getItem(getUserScopedKey('glucowave_user_profile'));
        if (raw) return JSON.parse(raw);
    } catch (error) {
        console.warn('Failed to read user profile from storage', error);
    }
    
    return {
        wakingTime: '07:00',
        breakfastTime: '08:00',
        lunchTime: '13:00',
        dinnerTime: '19:00',
        activityLevel: 'Normal',
        isf: '40',
        icr: '10'
    };
}

/**
 * Predicts the continuous 12-hour trajectory recursively.
 * Generates a high-res (15-min interval) curve combining ML baseline drift 
 * with explicit biological equations (ISF & ICR).
 * 
 * Takes currentGlucose, and mathematically digests the exact explicit meal payload 
 * entered by the user based on exactly how many minutes have passed since they ate it!
 */
export function predictTrajectoryML(currentGlucose, lastMealTime, mealType) {
  if (!globalMLRModel) {
      console.warn("ML Model not yet initialized.");
      return null;
  }
  
  const profile = getUserProfile();
  const activityCode = ACTIVITY_MAP[profile.activityLevel] ?? 1;
  const icr = parseFloat(profile.icr) || 10;
  const isf = parseFloat(profile.isf) || 40;
  
  const now = new Date();
  let currentHourDecimal = now.getHours() + now.getMinutes() / 60.0;

  const trajectoryData = [];
  const trajectoryLabels = [];

  let simGlucose = currentGlucose;
  
  // ── HISTORICAL DIGESTION CALCULATION ──
  // Calculate exactly what the user ate and when
  const baseCarbs = mealType === 'rice_and_dal' ? 75 : 60; // 75g fixed input for Rice and Dal
  const totalInsulin = baseCarbs / icr;                    // Total bolus for that meal

  // Determine elapsed time since they ate to calculate how much has already digested!
  const mealDecimal = parseTimeToDecimal(lastMealTime);
  let timeDiffHours = currentHourDecimal - mealDecimal;
  
  // Handle midnight wraparound
  if (timeDiffHours < 0) {
      if (timeDiffHours < -12) timeDiffHours += 24; 
      else timeDiffHours = 0; // If it's a future time error, default to 0 elapsed
  }

  // Activity multipliers for insulin decay
  let insAbsorbRate = 0.10; // Normal: 10% per 15 mins
  if (activityCode === 2) insAbsorbRate = 0.15; // High
  if (activityCode === 0) insAbsorbRate = 0.08; // Low

  // Run a shadow simulation to burn away the carbs/insulin that digested BEFORE the current reading
  const pastSteps = Math.min(Math.max(0, Math.round(timeDiffHours * 4)), 48); // Cap at 12 hours ago
  
  let activeCarbs = baseCarbs;
  let activeInsulin = totalInsulin;

  for (let s = 0; s < pastSteps; s++) {
      activeCarbs -= (activeCarbs * 0.15);
      activeInsulin -= (activeInsulin * insAbsorbRate);
  }
  // The variables `activeCarbs` and `activeInsulin` now hold ONLY the exact 
  // undigested payload still sitting in the system as of exactly *right now*!

  // 12 hours * 4 step/hr = 48 steps (15 mins each)
  const TOTAL_STEPS = 48;
  const STEP_HOURS = 0.25; // 15 mins
  const carbSensitivityFactor = isf / icr;

  // ── FUTURE TRAJECTORY SIMULATION ──
  for (let step = 0; step <= TOTAL_STEPS; step++) {
      const stepDate = new Date(now.getTime() + (step * 15 * 60000));
      const label = stepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      trajectoryLabels.push(label);
      trajectoryData.push(Math.round(simGlucose));

      if (step === TOTAL_STEPS) break;

      let nextHourDecimal = currentHourDecimal + STEP_HOURS;

      // --- 1. ML BASELINE DRIFT ---
      const mlPrediction2Hr = globalMLRModel.predict([simGlucose, 0, 0, activityCode, (currentHourDecimal % 24)])[0];
      const mlDelta2Hr = mlPrediction2Hr - simGlucose;
      const mlBaselineStep = mlDelta2Hr / 8.0; // scale 2HR delta to 15m step

      // --- 2. BIOLOGICAL CARB ABSORPTION ---
      const absorbedCarbs = activeCarbs * 0.15;
      activeCarbs -= absorbedCarbs;
      const carbSpike = absorbedCarbs * carbSensitivityFactor;

      // --- 3. BIOLOGICAL INSULIN DECAY ---
      const absorbedInsulin = activeInsulin * insAbsorbRate;
      activeInsulin -= absorbedInsulin;
      const insulinDrop = absorbedInsulin * isf;

      // Compute final next glucose!
      simGlucose = simGlucose + mlBaselineStep + carbSpike - insulinDrop;

      currentHourDecimal = nextHourDecimal;
  }

  setTimeout(() => {
      handleOnlineRetraining(currentGlucose, 0, 0, activityCode);
  }, 50);

  return {
      labels: trajectoryLabels,
      data: trajectoryData,
      timeToDip: calculateDipTime(trajectoryLabels, trajectoryData),
      probableDropTime: calculateDropStartTime(trajectoryLabels, trajectoryData),
      rawPredictions: trajectoryData
  };
}

/**
 * Handle accumulating personal data into localStorage and dynamically retraining
 */
function handleOnlineRetraining(currGlucose, currCarbs, currInsulin, currActivity) {
    try {
        const nowMs = Date.now();
        const prevInputRaw = localStorage.getItem(getUserScopedKey('glucowave_prev_input'));
        
        if (prevInputRaw) {
            const prev = JSON.parse(prevInputRaw);
            const diffMins = (nowMs - prev.timestamp) / 60000;
            
            // If they took a reading between 30 mins and 4 hours ago, that's clean data to learn from!
            if (diffMins >= 30 && diffMins <= 240) {
                // The PREVIOUS reading was the Features(X), the CURRENT reading represents the true observed Target(Y)
                const newFeature = [prev.glucose, prev.carbs, prev.insulin, prev.activity, prev.hour];
                const newTarget = [currGlucose];
                
                historicalFeatures.push(newFeature);
                historicalTargets.push(newTarget);
                
                // Re-fit the model with the exact personal ground truth
                globalMLRModel = new MLR(historicalFeatures, historicalTargets);
                console.log(`Model successfully RETRAINED online with new personal input point! Diff: ${Math.round(diffMins)}m`);
                
                savePersonalHistory(newFeature, newTarget);
            }
        }
        
        // Save current as the starting point for the *next* time they visit
        const newRecord = {
            timestamp: nowMs,
            glucose: currGlucose,
            carbs: currCarbs,
            insulin: currInsulin,
            activity: currActivity,
            hour: new Date().getHours() + new Date().getMinutes() / 60.0
        };
        localStorage.setItem(getUserScopedKey('glucowave_prev_input'), JSON.stringify(newRecord));
        
    } catch (e) {
        console.error("Online retraining sync failed", e);
    }
}

function calculateDipTime(labels, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i] < 70) return labels[i];
    }
    return "None detected";
}

function calculateDropStartTime(labels, data) {
    for (let i = 1; i < data.length; i++) {
        // If the current value is explicitly less than the previous, a drop has started
        if (data[i] < data[i - 1]) return labels[i];
    }
    return "Continuous";
}

function savePersonalHistory(x, y) {
    try {
        let hist = JSON.parse(localStorage.getItem(getUserScopedKey('glucowave_personal_history')) || '{"features":[],"targets":[]}');
        hist.features.push(x);
        hist.targets.push(y);
        localStorage.setItem(getUserScopedKey('glucowave_personal_history'), JSON.stringify(hist));
    } catch (error) {
        console.warn('Failed to save personal history', error);
    }
}

function loadPersonalHistory() {
    try {
        const histRaw = localStorage.getItem(getUserScopedKey('glucowave_personal_history'));
        if (histRaw) {
            const hist = JSON.parse(histRaw);
            if (hist.features && hist.targets) {
                historicalFeatures.push(...hist.features);
                historicalTargets.push(...hist.targets);
                // Retrain to include personal data immediately on app load
                globalMLRModel = new MLR(historicalFeatures, historicalTargets);
                console.log(`Loaded ${hist.features.length} personal historical rows into ML memory.`);
            }
        }
    } catch (error) {
        console.warn('Failed to load personal history', error);
    }
}
