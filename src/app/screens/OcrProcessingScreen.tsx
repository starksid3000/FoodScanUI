import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

type OcrState = 'device' | 'cloud' | 'scoring' | 'complete' | 'error';

const CONFIG: Record<OcrState, { label: string; sub: string }> = {
  device: { label: 'Reading label on device…', sub: 'This usually takes 3–6 seconds' },
  cloud: { label: 'Enhancing with cloud analysis…', sub: 'Label quality low — switching to enhanced scan…' },
  scoring: { label: 'Scoring ingredients…', sub: 'Almost there…' },
  complete: { label: 'Done ✓', sub: '' },
  error: { label: 'Could not read label', sub: 'The image may be blurry or too dark.' },
};

function DeviceIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="13" y="4" width="26" height="44" rx="4" stroke="#1A6B3C" strokeWidth="2.5" />
      <line x1="19" y1="16" x2="33" y2="16" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="23" x2="33" y2="23" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="30" x2="27" y2="30" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M39 34a9 9 0 0 0-9-9 9 9 0 0 0-18 0 9 9 0 0 0 0 18h27a9 9 0 0 0 0-18" stroke="#F4A323" strokeWidth="2.5" fill="none" />
      <path d="M26 43V25M20 31l6-6 6 6" stroke="#F4A323" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScoringIcon() {
  const circ = 2 * Math.PI * 20;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="20" stroke="#E8E8E8" strokeWidth="4" />
      <motion.circle cx="26" cy="26" r="20" stroke="#1A6B3C" strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} animate={{ strokeDashoffset: [circ, circ * 0.28] }} transition={{ duration: 2, ease: 'easeInOut' }} style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px' }} />
    </svg>
  );
}

function CompleteIcon() {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 260 }} style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#1A6B3C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    </motion.div>
  );
}

function ErrorIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M26 6L4 46h44L26 6Z" stroke="#F4A323" strokeWidth="2.5" fill="none" />
      <line x1="26" y1="22" x2="26" y2="34" stroke="#F4A323" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="40" r="2" fill="#F4A323" />
    </svg>
  );
}

const ICONS: Record<OcrState, React.ReactNode> = {
  device: <DeviceIcon />,
  cloud: <CloudIcon />,
  scoring: <ScoringIcon />,
  complete: <CompleteIcon />,
  error: <ErrorIcon />,
};

export default function OcrProcessingScreen() {
  const navigate = useNavigate();
  const [ocrState, setOcrState] = useState<OcrState>('device');
  const [progress, setProgress] = useState(0);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const tCancel = setTimeout(() => setShowCancel(true), 3000); // cancel only after 3s
    const t1 = setTimeout(() => { setOcrState('cloud'); setProgress(30); }, 2200);
    const t2 = setTimeout(() => { setOcrState('scoring'); setProgress(70); }, 4800);
    const t3 = setTimeout(() => { setOcrState('complete'); setProgress(100); }, 6800);
    const t4 = setTimeout(() => navigate('/label-results'), 7200);
    return () => { clearTimeout(tCancel); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [navigate]);

  const { label, sub } = CONFIG[ocrState];
  const isDeterminate = ocrState !== 'device';

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      <div className="flex-none px-6 flex items-center" style={{ height: '59px' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A' }}>9:41</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* Thumbnail with shimmer */}
        <motion.div
          style={{ width: '280px', height: '180px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          animate={{ opacity: ocrState === 'complete' ? 1 : [0.7, 1, 0.7] }}
          transition={ocrState === 'complete' ? {} : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ width: '100%', height: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </motion.div>

        {/* Animated icon */}
        <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div key={ocrState} initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }} transition={{ duration: 0.22 }}>
              {ICONS[ocrState]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-1 text-center">
            <span style={{ fontSize: '17px', fontWeight: '600', color: '#1A1A1A' }}>{label}</span>
            {sub && <span style={{ fontSize: '14px', color: '#888888' }}>{sub}</span>}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '4px', background: '#E8E8E8', borderRadius: '999px', overflow: 'hidden' }}>
          {isDeterminate ? (
            <motion.div style={{ height: '100%', background: '#1A6B3C', borderRadius: '999px' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          ) : (
            <motion.div style={{ height: '100%', width: '35%', background: '#1A6B3C', borderRadius: '999px' }} animate={{ x: ['-100%', '390%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
          )}
        </div>

        {/* Error actions */}
        {ocrState === 'error' && (
          <div className="flex flex-col items-center gap-3 w-full">
            <button onClick={() => navigate('/scanner')} className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white" style={{ background: '#1A6B3C' }}>Try Again</button>
            <button style={{ color: '#1A6B3C', fontSize: '14px' }}>Enter Manually</button>
          </div>
        )}
      </div>

      {/* Cancel — only after 3s */}
      <AnimatePresence>
        {showCancel && ocrState !== 'complete' && ocrState !== 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-none flex justify-center pb-12">
            <button onClick={() => navigate('/scanner')} className="px-10 py-3 rounded-2xl text-sm" style={{ border: '1px solid rgba(0,0,0,0.14)', color: '#888888', minHeight: '44px' }}>Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
