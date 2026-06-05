import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AlertTriangle, X, ShoppingBag } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

const DETECTED_ALLERGENS = [
  { name: 'Gluten', source: 'Whole Grain Oats', severity: 'high' },
  { name: 'Soy', source: 'Soy Lecithin (E322)', severity: 'medium' },
];

export default function AllergenAlertScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#FFFBFB' }}>
      <StatusBar />

      {/* Alert banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-5 mt-4 rounded-2xl p-4 flex-none"
        style={{ background: '#FFEBEE', border: '1.5px solid #EF5350' }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-none"
            style={{ background: '#FFCDD2' }}
          >
            <AlertTriangle size={20} color="#C62828" />
          </motion.div>
          <div className="flex-1">
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#B71C1C' }}>Allergen Alert</p>
            <p className="text-sm mt-0.5" style={{ color: '#C62828' }}>
              This product contains {DETECTED_ALLERGENS.length} of your flagged allergens
            </p>
          </div>
          <button onClick={() => navigate(-1)}>
            <X size={20} color="#C62828" />
          </button>
        </div>
      </motion.div>

      {/* Allergen list */}
      <div className="flex-1 px-5 pt-5 flex flex-col gap-4 overflow-y-auto pb-[120px]">
        <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#1A1A1A' }}>Detected Allergens</h2>

        {DETECTED_ALLERGENS.map((allergen, i) => (
          <motion.div
            key={allergen.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.25 }}
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)', border: '1px solid #FFE0E0' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-none"
                style={{ background: allergen.severity === 'high' ? '#FFCDD2' : '#FFF8E1' }}
              >
                <AlertTriangle size={18} color={allergen.severity === 'high' ? '#C62828' : '#F57F17'} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A1A' }}>{allergen.name}</p>
                <p className="text-sm" style={{ color: '#888888' }}>Found in: {allergen.source}</p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: allergen.severity === 'high' ? '#FFEBEE' : '#FFF8E1',
                  color: allergen.severity === 'high' ? '#B71C1C' : '#E65100',
                }}
              >
                {allergen.severity === 'high' ? 'High Risk' : 'Moderate'}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Safe alternatives suggestion */}
        <div className="bg-white rounded-2xl p-4 mt-2" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)', border: '1px solid #E8F5E9' }}>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={16} color="#1A6B3C" />
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A' }}>Safer Alternatives</p>
          </div>
          <p className="text-sm" style={{ color: '#555555' }}>
            We found 3 products similar to this one that don't contain your flagged allergens.
          </p>
          <button
            className="mt-3 text-sm font-semibold"
            style={{ color: '#1A6B3C' }}
          >
            View alternatives →
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-white" style={{ borderTop: '1px solid #F0F0F0', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/results')}
            className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
            style={{ border: '1.5px solid #E0E0E0', color: '#555555', background: 'transparent' }}
          >
            View Full Report
          </button>
          <button
            onClick={() => navigate('/scanner')}
            className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#1A6B3C' }}
          >
            Scan Another
          </button>
        </div>
      </div>
    </div>
  );
}
