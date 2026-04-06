// Generate glucose data for charts
const generateGlucoseData = (hours, interval = 1) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i -= interval) {
    const time = new Date(now - i * 60 * 60 * 1000);
    const hour = time.getHours();
    // Simulate realistic glucose patterns
    let base = 110;
    if (hour >= 7 && hour <= 9) base = 140; // breakfast spike
    if (hour >= 12 && hour <= 14) base = 135; // lunch spike
    if (hour >= 18 && hour <= 20) base = 145; // dinner spike
    if (hour >= 2 && hour <= 5) base = 90; // dawn dip
    const noise = (Math.random() - 0.5) * 30;
    const glucose = Math.round(base + noise);

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      glucose: Math.max(60, Math.min(200, glucose)),
      predicted: Math.max(60, Math.min(200, glucose + Math.round((Math.random() - 0.5) * 20))),
    });
  }
  return data;
};

export const glucoseDataToday = generateGlucoseData(24, 0.5);
export const glucoseDataWeek = generateGlucoseData(168, 4);
export const glucoseDataMonth = generateGlucoseData(720, 24);

export const currentGlucose = {
  value: 115,
  unit: 'mg/dl',
  status: 'normal', // 'normal', 'low', 'high'
  trend: 'stable', // 'rising', 'falling', 'stable'
  lastUpdated: '2 min ago',
};

export const predictionData = {
  risk: 72,
  timeWindow: '30 mins',
  level: 'warning', // 'safe', 'warning', 'danger'
  predictedValue: 82,
  confidence: 89,
};

export const insulinLogs = [
  { id: 1, type: 'Rapid-Acting', units: 4, time: '08:15 AM', date: 'Today' },
  { id: 2, type: 'Long-Acting', units: 12, time: '10:00 PM', date: 'Yesterday' },
  { id: 3, type: 'Rapid-Acting', units: 3, time: '12:30 PM', date: 'Yesterday' },
  { id: 4, type: 'Rapid-Acting', units: 5, time: '06:45 PM', date: 'Yesterday' },
];

export const mealLogs = [
  { id: 1, name: 'Oatmeal & Berries', carbs: 45, time: '08:00 AM', date: 'Today', type: 'breakfast' },
  { id: 2, name: 'Grilled Chicken Salad', carbs: 30, time: '12:30 PM', date: 'Today', type: 'lunch' },
  { id: 3, name: 'Pasta & Veggies', carbs: 65, time: '07:00 PM', date: 'Yesterday', type: 'dinner' },
  { id: 4, name: 'Apple & Peanut Butter', carbs: 25, time: '03:30 PM', date: 'Yesterday', type: 'snack' },
];

export const activityLogs = [
  { id: 1, name: 'Morning Walk', duration: '30 min', calories: 150, time: '07:00 AM', date: 'Today', intensity: 'low' },
  { id: 2, name: 'Yoga Session', duration: '45 min', calories: 200, time: '06:00 PM', date: 'Yesterday', intensity: 'medium' },
  { id: 3, name: 'Cycling', duration: '20 min', calories: 180, time: '05:30 PM', date: 'Yesterday', intensity: 'high' },
];

export const alerts = [
  {
    id: 1,
    type: 'danger',
    title: 'High Risk Detected',
    message: 'Glucose predicted to drop below 70 mg/dl in the next 30 minutes',
    risk: 85,
    timeWindow: '30 mins',
    timestamp: '10 min ago',
    actions: ['Consume 15g carbs', 'Avoid exercise', 'Recheck in 15 mins'],
    isActive: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Moderate Risk',
    message: 'Glucose trend declining faster than usual after dinner',
    risk: 55,
    timeWindow: '1 hour',
    timestamp: '45 min ago',
    actions: ['Monitor closely', 'Have a light snack ready'],
    isActive: true,
  },
  {
    id: 3,
    type: 'safe',
    title: 'Pattern Resolved',
    message: 'Morning spike has returned to normal range',
    risk: 12,
    timeWindow: 'N/A',
    timestamp: '2 hours ago',
    actions: [],
    isActive: false,
  },
];

export const analyticsPatterns = [
  { id: 1, pattern: 'Frequent drops at 6 PM', frequency: '4 times this week', severity: 'warning' },
  { id: 2, pattern: 'Post-breakfast spikes above 160', frequency: '3 times this week', severity: 'warning' },
  { id: 3, pattern: 'Stable overnight glucose', frequency: 'Every night', severity: 'safe' },
  { id: 4, pattern: 'Exercise lowers glucose by ~25 mg/dl', frequency: 'Consistent', severity: 'safe' },
];

export const weeklyStats = {
  avgGlucose: 118,
  timeInRange: 78,
  hypoEvents: 2,
  hyperEvents: 3,
  logsRecorded: 24,
};
