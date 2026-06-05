export function StatusBar() {
  return (
    <div
      className="flex-none flex items-center justify-between px-6"
      style={{ height: '59px', background: 'white' }}
    >
      <span style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A' }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="#1A1A1A">
          <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.4" />
          <rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.6" />
          <rect x="9" y="0" width="3" height="12" rx="1" opacity="0.8" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#1A1A1A">
          <circle cx="8" cy="9" r="2" />
          <path d="M5 5.8C5.7 5 6.8 4.5 8 4.5C9.2 4.5 10.3 5 11 5.8L12.5 4.3C11.4 3.2 9.8 2.5 8 2.5C6.2 2.5 4.6 3.2 3.5 4.3L5 5.8Z" opacity="0.7" />
          <path d="M8 1.5C9.8 1.5 11.4 2.3 12.5 3.5L14 2C12.4 0.8 10.3 0 8 0C5.7 0 3.6 0.8 2 2L3.5 3.5C4.6 2.3 6.2 1.5 8 1.5Z" opacity="0.4" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#1A1A1A" strokeOpacity="0.35" />
          <rect x="22" y="3.5" width="2.5" height="5" rx="1.25" fill="#1A1A1A" fillOpacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="#1A1A1A" />
        </svg>
      </div>
    </div>
  );
}
