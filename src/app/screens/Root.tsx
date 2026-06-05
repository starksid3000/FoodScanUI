import { Outlet, useNavigate, useLocation } from 'react-router';

const SCREENS = [
  { label: 'Onboarding', path: '/' },
  { label: 'Scanner', path: '/scanner' },
  { label: 'Results (Barcode)', path: '/results' },
  { label: 'History', path: '/history' },
  { label: 'Profile', path: '/profile' },
  { label: 'Allergen Alert', path: '/allergen-alert' },
  { label: 'Health Setup', path: '/health-setup' },
  { label: '2C Label Crop', path: '/label-crop' },
  { label: '2D OCR Processing', path: '/ocr-processing' },
  { label: '3B Label Results', path: '/label-results' },
];

export default function Root() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 py-8 px-4"
      style={{ background: '#1A1A2E', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Screen picker */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xl">
        {SCREENS.map((s) => (
          <button
            key={s.path}
            onClick={() => navigate(s.path)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: pathname === s.path ? '#1A6B3C' : 'rgba(255,255,255,0.1)',
              color: pathname === s.path ? 'white' : 'rgba(255,255,255,0.65)',
              border: pathname === s.path ? 'none' : '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* iPhone 15 Pro frame */}
      <div
        className="relative flex-none"
        style={{
          width: '393px',
          height: '852px',
          borderRadius: '54px',
          background: '#1A1A1A',
          boxShadow: `
            0 0 0 2px #3A3A3A,
            0 0 0 3px #222,
            0 30px 80px rgba(0,0,0,0.8),
            inset 0 0 0 1px rgba(255,255,255,0.06)
          `,
          overflow: 'hidden',
        }}
      >
        {/* Side buttons */}
        <div className="absolute" style={{ left: '-3px', top: '120px', width: '3px', height: '32px', background: '#2A2A2A', borderRadius: '2px 0 0 2px' }} />
        <div className="absolute" style={{ left: '-3px', top: '168px', width: '3px', height: '64px', background: '#2A2A2A', borderRadius: '2px 0 0 2px' }} />
        <div className="absolute" style={{ left: '-3px', top: '244px', width: '3px', height: '64px', background: '#2A2A2A', borderRadius: '2px 0 0 2px' }} />
        <div className="absolute" style={{ right: '-3px', top: '168px', width: '3px', height: '96px', background: '#2A2A2A', borderRadius: '0 2px 2px 0' }} />

        {/* Screen area */}
        <div
          className="absolute overflow-hidden"
          style={{ inset: '1px', borderRadius: '53px', background: '#F8F9FA' }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
