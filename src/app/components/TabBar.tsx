import { useNavigate, useLocation } from 'react-router';

const TABS = [
  {
    label: 'Scan',
    path: '/scanner',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6B3C' : '#AAAAAA'} strokeWidth="2.5">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
      </svg>
    ),
  },
  {
    label: 'History',
    path: '/history',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6B3C' : '#AAAAAA'} strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6B3C' : '#AAAAAA'} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex items-center bg-white"
      style={{
        height: '83px',
        borderTop: '1px solid #F0F0F0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-[34px]"
            style={{ minHeight: '44px' }}
          >
            {tab.icon(active)}
            <span
              className="text-xs"
              style={{ color: active ? '#1A6B3C' : '#AAAAAA', fontWeight: active ? '600' : '400' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
