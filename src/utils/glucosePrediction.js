/**
 * GlucoWave AI Prediction Engine
 * Ported from: https://github.com/raushan-oss/Sugarlevel/blob/main/logic.py
 *
 * Implements:
 *  - Clinically validated LBGI (Low Blood Glucose Index) scoring
 *  - 12-hour trajectory forecasting with meal spike/decay modeling
 *  - Risk classification (LOW / MEDIUM / HIGH)
 */

// ── LBGI Risk ──────────────────────────────────────────────────────
/**
 * Clinically validated Low Blood Glucose Index (LBGI) formula.
 * Transforms glucose (mg/dL) into a specialized risk value.
 */
export function calculateLBGIRisk(glucose) {
  if (glucose < 1) glucose = 1; // Avoid log(0)

  // fbg = 1.509 * (ln(G)^1.084 - 5.381)
  const fbg = 1.509 * (Math.pow(Math.log(glucose), 1.084) - 5.381);

  // Only readings below the center contribute to LBGI risk
  const riskValue = Math.min(0, fbg);

  // LBGI component: 10 * risk^2
  return 10 * riskValue * riskValue;
}

// ── Dynamic Drop Rate ──────────────────────────────────────────────
/**
 * Returns a baseline glucose drop-rate (mg/dL per minute).
 * In the original Python code this learns from a CSV + SQLite history.
 * Since we're client-side, we use a sensible clinical default.
 */
function getBaseDropRate() {
  return 0.25; // mg/dL per minute – matches the Python fallback
}

// ── 12-Hour Trajectory Forecast ────────────────────────────────────
/**
 * Builds a 12-hour glucose trajectory (30-min intervals).
 *
 * @param {number}   currentGlucose   Current glucose reading (mg/dL)
 * @param {string}   activity         'Low' | 'Normal' | 'High'
 * @param {object}   mealTimes        { breakfast: 'HH:MM', lunch: 'HH:MM', dinner: 'HH:MM' }
 * @param {Date}     [now]            Optional override for "current time"
 *
 * @returns {{ labels: string[], data: number[], timeToDip: string }}
 */
export function predictDailyTrajectory(
  currentGlucose,
  activity = 'Normal',
  mealTimes = { breakfast: '08:00', lunch: '13:00', dinner: '19:00' },
  now = new Date()
) {
  const activityMap = { Low: 0.8, Normal: 1.0, High: 1.4 };
  const multiplier = activityMap[activity] ?? 1.0;

  // Build meal datetime list (yesterday, today, tomorrow for wrap-around)
  const meals = [];
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  Object.values(mealTimes).forEach((time) => {
    if (!time) return;
    const [h, m] = time.split(':').map(Number);
    for (const dayOffset of [-1, 0, 1]) {
      const dt = new Date(now);
      dt.setDate(dt.getDate() + dayOffset);
      dt.setHours(h, m, 0, 0);
      meals.push(dt);
    }
  });

  const baseLevel = 95.0; // Healthier clinical baseline
  const learnedDropRate = getBaseDropRate() * multiplier;

  // Generate 12 hours of 30-min intervals
  const futureMinutes = [];
  for (let t = 0; t < 12 * 60; t += 30) futureMinutes.push(t);

  const simulatedCurve = [];

  futureMinutes.forEach((leadTime) => {
    const predTime = new Date(now.getTime() + leadTime * 60 * 1000);
    const pastMeals = meals.filter((m) => m <= predTime);

    let sugar;
    if (pastMeals.length > 0) {
      const lastMeal = pastMeals.reduce((a, b) => (a > b ? a : b));
      const minsSinceMeal = (predTime - lastMeal) / 60000;

      if (minsSinceMeal < 60) {
        sugar = baseLevel + (minsSinceMeal / 60.0) * 60;
      } else {
        const peak = baseLevel + 60;
        sugar = peak - (minsSinceMeal - 60) * learnedDropRate;
        if (sugar < 65.0) sugar = 65.0;
      }
    } else {
      sugar = baseLevel;
    }
    simulatedCurve.push(sugar);
  });

  // Calibrate predictions to anchor at current glucose
  const offsetStart = currentGlucose - simulatedCurve[0];
  const calibratedPredictions = [];

  futureMinutes.forEach((leadTime, i) => {
    let currentOffset;
    if (offsetStart > 0) {
      const blend = Math.max(0, 1.0 - leadTime / 240.0);
      currentOffset = offsetStart * blend;
    } else {
      currentOffset = offsetStart;
    }
    calibratedPredictions.push(simulatedCurve[i] + currentOffset);
  });

  // Build output
  let timeToDip = 'Stable';
  let foundDip = false;

  if (currentGlucose <= 70) {
    timeToDip = 'Already Low';
    foundDip = true;
  }

  const labels = [];
  const dataPoints = [];

  futureMinutes.forEach((leadTime, i) => {
    const predG = calibratedPredictions[i];
    const predTime = new Date(now.getTime() + leadTime * 60 * 1000);
    labels.push(
      predTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    );
    dataPoints.push(Math.round(predG * 10) / 10);

    if (!foundDip && predG <= 70 && leadTime > 0) {
      foundDip = true;
      timeToDip = `At ${predTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    }
  });

  return { labels, data: dataPoints, timeToDip };
}

// ── Risk Classification ────────────────────────────────────────────
/**
 * Classify current glucose risk.
 *
 * @param {number}  currentGlucose   Current glucose (mg/dL)
 * @param {string}  activity         Activity level
 * @param {number}  dropRate         Recent drop rate (mg/dL per minute), default 0
 *
 * @returns {{ riskLevel: string, explanation: string, lbgiScore: number, predicted30: number }}
 */
export function predictRisk(currentGlucose, activity = 'Normal', dropRate = 0) {
  const lbgiScore = calculateLBGIRisk(currentGlucose);
  const predicted30 = currentGlucose - dropRate * 30;

  let riskLevel = 'LOW';
  let explanation;

  if (lbgiScore >= 5.0 || currentGlucose <= 70 || predicted30 <= 70) {
    riskLevel = 'HIGH';
    explanation = '⚠️ Clinical high risk. LBGI score indicates severe instability.';
  } else if (lbgiScore >= 2.5 || dropRate > 1.0) {
    riskLevel = 'MEDIUM';
    explanation =
      'Moderate risk. Trend or biological scoring shows movement toward low range.';
  } else {
    explanation = 'Clinical indicators are stable. No immediate risk detected.';
  }

  return {
    riskLevel,
    explanation,
    lbgiScore: Math.round(lbgiScore * 100) / 100,
    predicted30: Math.round(predicted30 * 10) / 10,
  };
}

/**
 * Get recommended actions based on risk level.
 */
export function getRecommendations(riskLevel, currentGlucose) {
  if (riskLevel === 'HIGH') {
    return [
      { icon: '🍬', text: 'Consume 15-20g of fast-acting carbohydrates immediately' },
      { icon: '🚫', text: 'Avoid physical exercise until glucose stabilizes' },
      { icon: '⏰', text: 'Recheck glucose in 15 minutes' },
      { icon: '📞', text: 'Alert your care team if glucose continues to drop' },
    ];
  }
  if (riskLevel === 'MEDIUM') {
    return [
      { icon: '🥤', text: 'Have a light snack with 10-15g of carbs' },
      { icon: '👁️', text: 'Monitor glucose closely for the next hour' },
      { icon: '📊', text: 'Log your current activity and meal intake' },
      { icon: '💤', text: 'Reduce physical exertion if possible' },
    ];
  }
  return [
    { icon: '✅', text: 'Your glucose levels are within a healthy range' },
    { icon: '🏃', text: 'Continue your regular activity routine' },
    { icon: '📝', text: 'Keep logging meals and readings for better predictions' },
    { icon: '😊', text: 'Next check recommended in 2-4 hours' },
  ];
}
