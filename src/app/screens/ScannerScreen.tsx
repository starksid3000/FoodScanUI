import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Flashlight, FlashlightOff, Clock, Keyboard, HelpCircle, User } from 'lucide-react';

type ScanMode = 'barcode' | 'label';
type LabelState = 'idle' | 'detecting' | 'confident' | 'fallback' | 'processing';

function OverlayPill({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'white',
        minWidth: '44px',
        minHeight: '44px',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}

export default function ScannerScreen() {
  const navigate = useNavigate();
  const _frameRef = useRef<HTMLDivElement>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>('barcode');
  const [barcodeDetected, setBarcodeDetected] = useState(false);
  const [labelState, setLabelState] = useState<LabelState>('idle');
  const [showTooltip, setShowTooltip] = useState(false);

  // Barcode mode: auto-detect after 5s
  useEffect(() => {
    if (scanMode !== 'barcode') return;
    setBarcodeDetected(false);
    const t = setTimeout(() => {
      setBarcodeDetected(true);
      setTimeout(() => navigate('/results'), 1200);
    }, 5000);
    return () => clearTimeout(t);
  }, [navigate, scanMode]);

  // Label mode: idle → detecting → confident → processing
  useEffect(() => {
    if (scanMode !== 'label') return;
    setLabelState('idle');
    const t1 = setTimeout(() => setLabelState('detecting'), 2000);
    const t2 = setTimeout(() => setLabelState('confident'), 4200);
    const t3 = setTimeout(() => {
      setLabelState('processing');
      setTimeout(() => navigate('/label-crop'), 700);
    }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate, scanMode]);

  const dotColor = labelState === 'idle' ? '#888888' : labelState === 'detecting' ? '#F4A323' : '#1A6B3C';
  const confidence = labelState === 'idle' ? 8 : labelState === 'detecting' ? 63 : 91;
  const bracketColor = labelState === 'idle' ? 'rgba(180,180,180,0.5)' : '#1A6B3C';

  function switchMode(m: ScanMode) {
    setScanMode(m);
    setBarcodeDetected(false);
    setLabelState('idle');
    setShowTooltip(false);
  }

  const corners = [
    { top: 0, left: 0, bT: true, bL: true },
    { top: 0, right: 0, bT: true, bR: true },
    { bottom: 0, left: 0, bB: true, bL: true },
    { bottom: 0, right: 0, bB: true, bR: true },
  ] as { top?: number; bottom?: number; left?: number; right?: number; bT?: boolean; bB?: boolean; bL?: boolean; bR?: boolean }[];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#000' }}>
      {/* Camera background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%)' }} />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.3)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)' }} />

      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 h-[59px] z-30">
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ width: '126px', height: '37px' }} />
        <span className="absolute top-4 left-6 text-[15px] font-semibold text-white z-10">9:41</span>
        <div className="absolute top-4 right-6 flex items-center gap-1.5 z-10">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="3" width="3" height="9" rx="1" opacity="0.4" /><rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.6" /><rect x="9" y="0" width="3" height="12" rx="1" opacity="0.8" /><rect x="13.5" y="0" width="3" height="12" rx="1" /></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><circle cx="8" cy="9" r="2" /><path d="M5 5.8C5.7 5 6.8 4.5 8 4.5C9.2 4.5 10.3 5 11 5.8L12.5 4.3C11.4 3.2 9.8 2.5 8 2.5C6.2 2.5 4.6 3.2 3.5 4.3L5 5.8Z" opacity="0.7" /><path d="M8 1.5C9.8 1.5 11.4 2.3 12.5 3.5L14 2C12.4 0.8 10.3 0 8 0C5.7 0 3.6 0.8 2 2L3.5 3.5C4.6 2.3 6.2 1.5 8 1.5Z" opacity="0.4" /></svg>
        </div>
      </div>

      {/* Top overlay */}
      <div className="absolute top-[69px] left-0 right-0 flex items-center justify-between px-5 z-30">
        <OverlayPill onClick={() => setTorchOn(!torchOn)}>
          {torchOn ? <Flashlight size={18} color="white" /> : <FlashlightOff size={18} color="rgba(255,255,255,0.8)" />}
        </OverlayPill>
        <span className="text-white text-sm font-medium opacity-80">FoodScan</span>
        {scanMode === 'label' ? (
          <OverlayPill onClick={() => setShowTooltip((v) => !v)}>
            <HelpCircle size={18} color="white" />
          </OverlayPill>
        ) : (
          <OverlayPill onClick={() => navigate('/profile')}>
            <User size={18} color="white" />
          </OverlayPill>
        )}
      </div>

      {/* Help tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute z-40 left-4 right-4"
            style={{ top: '122px' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <p className="text-white text-xs leading-relaxed">We capture automatically when the text is clear enough to read accurately.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BARCODE VIEWFINDER ── */}
      {scanMode === 'barcode' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-36">
          <div ref={_frameRef} className="relative" style={{ width: '280px', height: '180px' }}>
            {corners.map((c, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                  width: '24px', height: '24px',
                  borderColor: '#1A6B3C',
                  borderTopWidth: c.bT ? '3px' : '0', borderBottomWidth: c.bB ? '3px' : '0',
                  borderLeftWidth: c.bL ? '3px' : '0', borderRightWidth: c.bR ? '3px' : '0',
                  borderStyle: 'solid',
                }}
                animate={barcodeDetected ? { opacity: [1, 0.4, 1] } : { opacity: [0.65, 1, 0.65] }}
                transition={barcodeDetected ? { duration: 0.25, repeat: 3 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            {!barcodeDetected && (
              <motion.div
                style={{ position: 'absolute', left: '4px', right: '4px', height: '2px', background: 'linear-gradient(90deg, transparent, #1A6B3C, transparent)', boxShadow: '0 0 8px 3px rgba(26,107,60,0.55)', borderRadius: '2px' }}
                animate={{ top: ['4px', '172px'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {barcodeDetected && (
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(26,107,60,0.18)', borderRadius: '4px' }} />
            )}
          </div>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {barcodeDetected ? '✓ Barcode detected!' : 'Point at barcode or product'}
          </p>
        </div>
      )}

      {/* ── LABEL VIEWFINDER ── */}
      {scanMode === 'label' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-44">
          <div className="relative" style={{ width: '230px', height: '310px' }}>
            {corners.map((c, i) => (
              <div
                key={i}
                className="absolute transition-colors duration-300"
                style={{
                  top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                  width: '26px', height: '38px',
                  borderColor: bracketColor,
                  borderTopWidth: c.bT ? '3px' : '0', borderBottomWidth: c.bB ? '3px' : '0',
                  borderLeftWidth: c.bL ? '3px' : '0', borderRightWidth: c.bR ? '3px' : '0',
                  borderStyle: 'solid',
                }}
              />
            ))}
            {/* Shimmer top-to-bottom */}
            {(labelState === 'detecting' || labelState === 'confident') && (
              <motion.div
                style={{ position: 'absolute', left: '3px', right: '3px', height: '50px', background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)', borderRadius: '3px', pointerEvents: 'none' }}
                animate={{ top: ['3px', '257px'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {/* Confident pulse */}
            {labelState === 'confident' && (
              <motion.div className="absolute inset-0" animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ background: 'rgba(26,107,60,0.25)', borderRadius: '3px' }} />
            )}
            {/* Processing spinner */}
            {labelState === 'processing' && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '3px' }}>
                <motion.div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.25)', borderTopColor: '#1A6B3C' }} animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }} />
              </div>
            )}
            {/* Auto-capture dot */}
            <motion.div
              className="absolute"
              style={{ top: '10px', right: '10px', width: '10px', height: '10px', borderRadius: '50%', background: dotColor, transition: 'background 0.3s' }}
              animate={labelState === 'confident' ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
              transition={labelState === 'confident' ? { duration: 0.55, repeat: Infinity } : {}}
            />
            {/* Confidence readout (DEV ONLY) */}
            <div className="absolute" style={{ bottom: '8px', left: '8px' }}>
              <div className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', fontFamily: 'monospace' }}>
                  {labelState === 'idle' ? 'Scanning... 0%' : `Reading... ${confidence}%`}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {labelState === 'fallback' ? <span style={{ color: '#F4A323' }}>Switching to enhanced scan…</span>
              : labelState === 'confident' ? <span style={{ color: '#4CAF50' }}>✓ Label detected — capturing…</span>
              : labelState === 'processing' ? 'Processing…'
              : 'Frame the ingredient list'}
          </p>
        </div>
      )}

      {/* ── BOTTOM TRAY ── */}
      <div className="absolute bottom-0 left-0 right-0" style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        {/* Mode tabs */}
        <div className="flex items-center gap-1.5 px-5 pt-3">
          {(['barcode', 'label'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: scanMode === m ? '#1A6B3C' : 'rgba(255,255,255,0.1)',
                color: scanMode === m ? 'white' : 'rgba(255,255,255,0.55)',
                border: scanMode === m ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {m === 'barcode' ? 'Barcode' : 'Ingredient Label'}
            </button>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-around px-8 pt-3 pb-1">
          {/* Torch */}
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => setTorchOn(!torchOn)} className="w-11 h-11 flex items-center justify-center">
              {torchOn ? <Flashlight size={22} color="white" /> : <FlashlightOff size={22} color="rgba(255,255,255,0.65)" />}
            </button>
            <span className="text-white text-[10px] opacity-55">{torchOn ? 'On' : 'Torch'}</span>
          </div>

          {/* Shutter */}
          <motion.button
            onClick={() => {
              if (scanMode === 'barcode') { setBarcodeDetected(true); setTimeout(() => navigate('/results'), 400); }
              else navigate('/label-crop');
            }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: '68px', height: '68px',
              background: scanMode === 'label' ? '#1A6B3C' : 'white',
              border: scanMode === 'label' ? '3px solid rgba(255,255,255,0.28)' : '3px solid #1A6B3C',
              boxShadow: labelState === 'confident' ? '0 0 22px 6px rgba(26,107,60,0.7)' : 'none',
              transition: 'box-shadow 0.3s',
            }}
            whileTap={{ scale: 0.9 }}
          >
            {scanMode === 'label' ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            ) : (
              <div className="w-12 h-12 rounded-full" style={{ background: 'rgba(26,107,60,0.1)' }} />
            )}
          </motion.button>

          {/* Right: Manual */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-11 h-11 flex items-center justify-center">
              <Keyboard size={22} color="rgba(255,255,255,0.65)" />
            </button>
            <span className="text-white text-[10px] opacity-55">Manual</span>
          </div>
        </div>

        {scanMode === 'label' && (
          <p className="text-center text-[10px] pb-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Auto-captures when clear · or tap to capture now
          </p>
        )}

        {/* Tab bar */}
        <div className="flex items-start justify-around pt-2 pb-[34px]" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { label: 'Scan', path: '/scanner', active: true },
            { label: 'History', path: '/history', active: false },
            { label: 'Profile', path: '/profile', active: false },
          ].map((tab, i) => {
            const icons = [
              <svg key="s" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tab.active ? '#1A6B3C' : 'rgba(255,255,255,0.45)'} strokeWidth="2.5"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="1" /></svg>,
              <svg key="h" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
              <svg key="p" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
            ];
            return (
              <button key={i} onClick={() => navigate(tab.path)} className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center">
                {icons[i]}
                <span className="text-xs" style={{ color: tab.active ? '#1A6B3C' : 'rgba(255,255,255,0.45)' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
