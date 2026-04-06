import CircularProgress from '../ui/CircularProgress';
import { AlertTriangle, TrendingDown } from 'lucide-react';

export default function PredictionCard({ data }) {
  const statusLevel = data.risk >= 70 ? 'danger' : data.risk >= 40 ? 'warning' : 'safe';

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 flex flex-col items-center gap-5">
      <div className={`flex items-center gap-2 text-sm font-semibold ${statusLevel === 'danger' ? 'text-red-600' : statusLevel === 'warning' ? 'text-orange-600' : 'text-green-600'}`}>
        <AlertTriangle size={16} />
        AI Risk Prediction
      </div>

      <CircularProgress
        value={data.risk}
        size={140}
        strokeWidth={10}
        status={statusLevel}
        sublabel={`in ${data.timeWindow}`}
      />

      <div className="text-center">
        <p className="text-sm text-gray-700">
          Risk in next <span className="text-gray-900 font-semibold">{data.timeWindow}</span>
        </p>
        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 justify-center">
          <TrendingDown size={12} />
          Predicted: {data.predictedValue} mg/dl
        </p>
      </div>

      <div className="w-full p-3 rounded-xl bg-orange-50 text-center border border-orange-100">
        <p className="text-xs text-gray-600">Confidence</p>
        <p className="text-lg font-bold text-gray-900">{data.confidence}%</p>
      </div>
    </div>
  );
}
