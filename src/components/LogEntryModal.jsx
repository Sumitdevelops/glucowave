import { useState } from 'react';
import { Plus, X, Utensils, Syringe, Dumbbell } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../context/useAuth';
import { addUserLog } from '../services/userData';

const logOptions = [
  { icon: Utensils, label: 'Add Meal', description: 'Log food intake & carbs', color: 'from-accent-cyan to-safe' },
  { icon: Syringe, label: 'Add Insulin', description: 'Record insulin dose', color: 'from-accent-blue to-accent-purple' },
  { icon: Dumbbell, label: 'Add Activity', description: 'Track exercise & movement', color: 'from-accent-purple to-accent-pink' },
];

export default function LogEntryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSelect = (option) => {
    setSelected(option);
    setName('');
    setValue('');
    setError('');
  };

  const getLogType = () => {
    if (!selected) return null;
    if (selected.label === 'Add Meal') return 'meal';
    if (selected.label === 'Add Insulin') return 'insulin';
    return 'activity';
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please sign in first.');
      return;
    }
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 0) {
      setError('Enter a valid value.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const now = new Date();
      await addUserLog(user.uid, {
        type: getLogType(),
        name: name.trim(),
        value: numericValue,
        unit:
          selected?.label === 'Add Meal'
            ? 'g'
            : selected?.label === 'Add Insulin'
              ? 'u'
              : 'min',
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSelected(null);
        setSubmitted(false);
        setName('');
        setValue('');
      }, 1200);
    } catch (saveError) {
      setError(saveError.message || 'Failed to save log.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
      setIsOpen(false);
      setSelected(null);
      setSubmitted(false);
      setName('');
      setValue('');
      setError('');
  };

  return (
    <>
      {/* FAB Button */}
      <button className="fab" onClick={() => setIsOpen(true)} id="log-entry-fab">
        <Plus size={28} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content glass-card p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-[Poppins]">
                {submitted ? '✓ Logged!' : selected ? selected.label : 'New Log Entry'}
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-slate-400">Entry saved successfully</p>
              </div>
            ) : !selected ? (
              /* Option selection */
              <div className="flex flex-col gap-3">
                {logOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleSelect(option)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 border border-white/5 hover:border-accent-blue/30 hover:bg-navy-700/50 transition-all duration-200 text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} opacity-80 flex items-center justify-center flex-shrink-0`}>
                      <option.icon size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-accent-blue transition-colors">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Quick entry form */
              <div className="flex flex-col gap-4">
                {error && (
                  <div className="text-sm text-red-300 bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selected.label === 'Add Meal' ? 'e.g., Oatmeal & Berries' : selected.label === 'Add Insulin' ? 'e.g., Rapid-Acting' : 'e.g., Morning Walk'}
                    className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-white/10 text-white placeholder-slate-600 focus:border-accent-blue/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    {selected.label === 'Add Meal' ? 'Carbs (g)' : selected.label === 'Add Insulin' ? 'Units' : 'Duration (min)'}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-white/10 text-white placeholder-slate-600 focus:border-accent-blue/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <Button variant="secondary" size="sm" className="flex-1 justify-center" onClick={() => setSelected(null)}>
                    Back
                  </Button>
                  <Button size="sm" className="flex-1 justify-center" onClick={handleSubmit}>
                    {saving ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
