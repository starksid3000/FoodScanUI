import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

interface CropRegion { x: number; y: number; width: number; height: number; }
type DragCorner = 'tl' | 'tr' | 'bl' | 'br' | 'move';

const IMAGE_H_PX = 450;

function clampCrop(c: CropRegion, containerW: number): CropRegion {
  const minW = 120 / containerW;
  const minH = 80 / IMAGE_H_PX;
  let { x, y, width, height } = c;
  width = Math.max(minW, Math.min(1, width));
  height = Math.max(minH, Math.min(1, height));
  x = Math.max(0, Math.min(1 - width, x));
  y = Math.max(0, Math.min(1 - height, y));
  return { x, y, width, height };
}

function LHandle({ corner }: { corner: DragCorner }) {
  const isTop = corner === 'tl' || corner === 'tr';
  const isLeft = corner === 'tl' || corner === 'bl';
  const vBar: React.CSSProperties = { position: 'absolute', width: '3px', height: '18px', background: '#1A6B3C', boxShadow: '0 2px 6px rgba(0,0,0,0.55)', ...(isTop ? { top: 0 } : { bottom: 0 }), ...(isLeft ? { left: 0 } : { right: 0 }) };
  const hBar: React.CSSProperties = { position: 'absolute', width: '18px', height: '3px', background: '#1A6B3C', boxShadow: '0 2px 6px rgba(0,0,0,0.55)', ...(isTop ? { top: 0 } : { bottom: 0 }), ...(isLeft ? { left: 0 } : { right: 0 }) };
  return (
    <div style={{ position: 'relative', width: '24px', height: '24px' }}>
      <div style={vBar} />
      <div style={hBar} />
    </div>
  );
}

export default function LabelCropScreen() {
  const navigate = useNavigate();
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<CropRegion>({ x: 0.08, y: 0.08, width: 0.84, height: 0.84 });
  const dragRef = useRef<{ corner: DragCorner; startClientX: number; startClientY: number; startCrop: CropRegion } | null>(null);

  const startDrag = (corner: DragCorner, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { corner, startClientX: e.clientX, startClientY: e.clientY, startCrop: { ...crop } };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !imageAreaRef.current) return;
    const rect = imageAreaRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startClientX) / rect.width;
    const dy = (e.clientY - dragRef.current.startClientY) / rect.height;
    const sc = dragRef.current.startCrop;
    let next: CropRegion;
    switch (dragRef.current.corner) {
      case 'tl': next = { x: sc.x + dx, y: sc.y + dy, width: sc.width - dx, height: sc.height - dy }; break;
      case 'tr': next = { x: sc.x, y: sc.y + dy, width: sc.width + dx, height: sc.height - dy }; break;
      case 'bl': next = { x: sc.x + dx, y: sc.y, width: sc.width - dx, height: sc.height + dy }; break;
      case 'br': next = { x: sc.x, y: sc.y, width: sc.width + dx, height: sc.height + dy }; break;
      default: next = { x: sc.x + dx, y: sc.y + dy, width: sc.width, height: sc.height }; break;
    }
    setCrop(clampCrop(next, rect.width));
  };

  const W = 393;
  const H = IMAGE_H_PX;
  const px = { x: crop.x * W, y: crop.y * H, w: crop.width * W, h: crop.height * H };

  const cornerDefs: { corner: DragCorner; style: React.CSSProperties }[] = [
    { corner: 'tl', style: { top: `${px.y - 10}px`, left: `${px.x - 10}px` } },
    { corner: 'tr', style: { top: `${px.y - 10}px`, left: `${px.x + px.w - 34}px` } },
    { corner: 'bl', style: { top: `${px.y + px.h - 34}px`, left: `${px.x - 10}px` } },
    { corner: 'br', style: { top: `${px.y + px.h - 34}px`, left: `${px.x + px.w - 34}px` } },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      style={{ background: '#1A1A1A', borderRadius: '24px 24px 0 0' }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 flex-none">
        <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.28)', borderRadius: '2px' }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 flex-none">
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Cancel</button>
        <span style={{ color: 'white', fontSize: '17px', fontWeight: '600' }}>Adjust Crop</span>
        <button onClick={() => navigate('/ocr-processing')} style={{ color: '#1A6B3C', fontSize: '15px', fontWeight: '700', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Analyse</button>
      </div>

      {/* Image area */}
      <div
        ref={imageAreaRef}
        className="relative flex-none overflow-hidden"
        style={{ width: '393px', height: `${IMAGE_H_PX}px`, background: '#000' }}
        onPointerMove={onPointerMove}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
      >
        {/* Simulated label photo */}
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        {/* Dark overlay quadrants */}
        <div className="absolute left-0 right-0 top-0" style={{ height: `${px.y}px`, background: 'rgba(0,0,0,0.62)' }} />
        <div className="absolute left-0 right-0" style={{ top: `${px.y + px.h}px`, bottom: 0, background: 'rgba(0,0,0,0.62)' }} />
        <div className="absolute" style={{ top: `${px.y}px`, left: 0, width: `${px.x}px`, height: `${px.h}px`, background: 'rgba(0,0,0,0.62)' }} />
        <div className="absolute" style={{ top: `${px.y}px`, left: `${px.x + px.w}px`, right: 0, height: `${px.h}px`, background: 'rgba(0,0,0,0.62)' }} />

        {/* Crop border */}
        <div className="absolute pointer-events-none" style={{ left: `${px.x}px`, top: `${px.y}px`, width: `${px.w}px`, height: `${px.h}px`, border: '1.5px solid #1A6B3C' }} />

        {/* Drag-to-move region */}
        <div
          className="absolute flex items-center justify-center cursor-move"
          style={{ left: `${px.x + 44}px`, top: `${px.y + 44}px`, width: `${Math.max(0, px.w - 88)}px`, height: `${Math.max(0, px.h - 88)}px` }}
          onPointerDown={(e) => startDrag('move', e)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 3v18M3 12h18" />
          </svg>
        </div>

        {/* Corner handles */}
        {cornerDefs.map(({ corner, style }) => (
          <div key={corner} className="absolute flex items-center justify-center" style={{ ...style, width: '44px', height: '44px', cursor: 'nwse-resize' }} onPointerDown={(e) => startDrag(corner, e)}>
            <LHandle corner={corner} />
          </div>
        ))}
      </div>

      {/* Below image */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5">
        <p className="text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Drag the corners to frame only the ingredient list. Exclude barcodes, nutrition tables, and logos.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setCrop({ x: 0.08, y: 0.08, width: 0.84, height: 0.84 })} className="px-5 py-2.5 rounded-full text-sm" style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.75)', background: 'transparent' }}>Reset Crop</button>
          <button onClick={() => setCrop({ x: 0, y: 0, width: 1, height: 1 })} className="px-5 py-2.5 rounded-full text-sm" style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.75)', background: 'transparent' }}>Full Image</button>
        </div>
      </div>
    </motion.div>
  );
}
