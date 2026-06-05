import { useEffect, useState } from 'react';
import { getScoreColor, getScoreLabel } from '../data/mockData';

interface HealthScoreRingProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  showLabel?: boolean;
}

export function HealthScoreRing({ score, size = 'medium', animate = false, showLabel = false }: HealthScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [progress, setProgress] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) return;
    const start = Date.now();
    const duration = 1000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDisplayScore(Math.round(eased * score));
      setProgress(Math.round(eased * score));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [animate, score]);

  const dims = { small: 56, medium: 80, large: 120 };
  const strokes = { small: 5, medium: 7, large: 9 };
  const dim = dims[size];
  const stroke = strokes[size];
  const r = (dim - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ position: 'relative', width: dim, height: dim }}>
        <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: animate ? 'none' : 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: size === 'large' ? '28px' : size === 'medium' ? '20px' : '13px',
              fontWeight: '800',
              color,
              lineHeight: 1,
            }}
          >
            {displayScore}
          </span>
          {size !== 'small' && (
            <span style={{ fontSize: '9px', color: '#AAAAAA', marginTop: '1px' }}>/ 100</span>
          )}
        </div>
      </div>
      {showLabel && (
        <span style={{ fontSize: '13px', fontWeight: '600', color }}>{getScoreLabel(score)}</span>
      )}
    </div>
  );
}
