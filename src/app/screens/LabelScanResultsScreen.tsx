import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share2, ChevronRight, ChevronDown, ChevronUp, X, Info, ExternalLink, BookOpen, Globe, Check, RotateCcw } from 'lucide-react';
import { HealthScoreRing } from '../components/HealthScoreRing';
import { SafetyBadge } from '../components/SafetyBadge';
import { TabBar } from '../components/TabBar';
import { StatusBar } from '../components/StatusBar';
import { ingredients, getSafetyConfig, getScoreColor } from '../data/mockData';
import type { Ingredient } from '../data/mockData';

// ── OCR ingredient union ──────────────────────────────────────────────────────
type OcrIngredient =
  | { type: 'matched'; ingredient: Ingredient }
  | { type: 'unidentified'; id: string; rawText: string }
  | { type: 'corrupted'; id: string; corruptedText: string };

const OCR_INGREDIENTS: OcrIngredient[] = [
  { type: 'matched', ingredient: ingredients[0] },
  { type: 'matched', ingredient: ingredients[1] },
  { type: 'matched', ingredient: ingredients[2] },
  { type: 'matched', ingredient: ingredients[3] },
  { type: 'unidentified', id: 'u1', rawText: 'SOY LECITHIN' },
  { type: 'unidentified', id: 'u2', rawText: 'XANTHAN GUM' },
  { type: 'corrupted', id: 'c1', corruptedText: 'Natura| F|avour!ng' },
  { type: 'corrupted', id: 'c2', corruptedText: 'Vitam!n 0 (added)' },
];

const EXTRACTED_RAW = `INGREDIENTS: Whole Grain Oats (36%), Water, Sugar (8%),
Modif!ed Starch (E1442), SOY LECITHIN, XANTHAN GUM,
Emulsif!er (E471), Natura| F|avour!ng, Vitam!n 0 (added),
Salt (0.4%), Preservative (E202).

MAY CONTAIN: Nuts, Milk, Gluten.`;

const SCORE = 62;
const BREAKDOWN = { nutritional: 68, ingredientSafety: 55, processingLevel: 62, personalization: 70 };
const INSIGHTS: { type: 'positive' | 'warning' | 'negative'; text: string }[] = [
  { type: 'positive', text: '✓ Whole grain base' },
  { type: 'warning', text: '⚠ Contains E471' },
  { type: 'warning', text: '⚠ Added sugar' },
  { type: 'negative', text: '✗ 2 OCR errors' },
];
const ALTERNATIVES = [
  { id: 'a1', name: 'Organic Rolled Oats with Berries', brand: "Nature's Path", score: 88, image: 'https://images.unsplash.com/photo-1517673408408-f8f5c2a2e9e6?w=200&q=80' },
  { id: 'a2', name: 'Sugar-Free Muesli Bar', brand: 'Dorset Cereals', score: 79, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 350); return () => clearTimeout(t); }, [value]);
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm w-36 flex-none" style={{ color: '#555555' }}>{label}</span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '6px', background: '#E8E8E8' }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${w}%`, background: '#1A6B3C' }} />
      </div>
      <span className="text-sm font-semibold w-8 text-right" style={{ color: '#1A1A1A' }}>{value}</span>
      <span className="text-xs w-10" style={{ color: '#888888' }}>{weight}</span>
    </div>
  );
}

function InsightChip({ type, text, delay }: { type: 'positive' | 'warning' | 'negative'; text: string; delay: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const s = { positive: { bg: '#E8F5E9', color: '#1B5E20' }, warning: { bg: '#FFF8E1', color: '#E65100' }, negative: { bg: '#FFEBEE', color: '#B71C1C' } }[type];
  return (
    <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: vis ? 1 : 0, y: vis ? 0 : 8 }} transition={{ duration: 0.2 }} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: s.bg, color: s.color }}>
      {text}
    </motion.span>
  );
}

function IngredientSheet({ ingredient, onClose }: { ingredient: Ingredient; onClose: () => void }) {
  const sc = getSafetyConfig(ingredient.safety);
  const [expanded, setExpanded] = useState(false);
  const bannerBg = ingredient.safety === 'safe' ? '#E8F5E9' : ingredient.safety === 'caution' ? '#FFF8E1' : '#FFEBEE';
  const bannerText = ingredient.safety === 'safe' ? '#1B5E20' : ingredient.safety === 'caution' ? '#E65100' : '#B71C1C';
  const bannerMsg = ingredient.safety === 'safe' ? 'Generally Recognised as Safe' : ingredient.safety === 'caution' ? 'Use with caution' : 'Avoid';

  return (
    <motion.div className="absolute inset-0 z-50 flex flex-col justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div className="relative rounded-t-[40px] flex flex-col overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 8px 24px rgba(0,0,0,0.14)', height: expanded ? '92%' : '58%', transition: 'height 350ms cubic-bezier(0.34, 1.20, 0.64, 1)' }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
        <button onClick={() => setExpanded(!expanded)} className="flex flex-col items-center pt-3 pb-2 w-full flex-none">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E0E0E0' }} />
          <span className="text-[10px] mt-1" style={{ color: '#BBBBBB' }}>{expanded ? 'Collapse ↓' : 'Expand ↑'}</span>
        </button>
        <button onClick={onClose} className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full" style={{ background: '#F5F5F5' }}><X size={16} color="#555" /></button>
        <div className="overflow-y-auto px-5 pb-8 flex-1">
          <div className="flex items-start gap-3 pt-2 pb-1">
            <div className="flex-1"><h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A' }}>{ingredient.name}</h1><p className="text-xs uppercase tracking-wide" style={{ color: '#888888' }}>{ingredient.category}</p></div>
            {ingredient.eNumber && <span className="px-2.5 py-1 rounded-full text-sm font-semibold" style={{ background: '#F0F0F0', color: '#555555' }}>{ingredient.eNumber}</span>}
          </div>
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl mt-3" style={{ background: bannerBg }}>
            <div className="w-2 h-2 rounded-full flex-none" style={{ background: sc.dot }} />
            <span className="text-sm font-semibold" style={{ color: bannerText }}>{bannerMsg}</span>
          </div>
          <p className="mt-4 leading-relaxed" style={{ fontSize: '15px', color: '#555555' }}>{ingredient.description}</p>
          <div className="mt-5">
            <h3 className="font-semibold mb-3" style={{ fontSize: '16px', color: '#1A1A1A' }}>Health Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: '#FFEBEE' }}><p className="text-xs font-semibold mb-2" style={{ color: '#B71C1C' }}>⚠ Risks</p>{ingredient.risks.map((r, i) => <p key={i} className="text-xs mb-1" style={{ color: '#555555' }}>• {r}</p>)}</div>
              <div className="rounded-xl p-3" style={{ background: '#E8F5E9' }}><p className="text-xs font-semibold mb-2" style={{ color: '#1B5E20' }}>✓ Benefits</p>{ingredient.benefits.map((b, i) => <p key={i} className="text-xs mb-1" style={{ color: '#555555' }}>• {b}</p>)}</div>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontSize: '16px', color: '#1A1A1A' }}><Globe size={16} color="#1A6B3C" /> Regulation</h3>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #F0F0F0' }}>
              {ingredient.regulations.map((reg, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: i < ingredient.regulations.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <span className="text-base">{reg.flag}</span>
                  <span className="flex-1 text-sm" style={{ color: '#1A1A1A' }}>{reg.country}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${reg.statusColor}20`, color: reg.statusColor }}>{reg.status}</span>
                </div>
              ))}
            </div>
          </div>
          {ingredient.research && ingredient.research.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontSize: '16px', color: '#1A1A1A' }}><BookOpen size={16} color="#1A6B3C" /> Research</h3>
              {ingredient.research.map((r, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-2" style={{ background: '#F8F9FA', border: '1px solid #E8E8E8' }}>
                  <BookOpen size={14} color="#888888" />
                  <span className="text-sm flex-1 truncate" style={{ color: '#555555' }}>{r}</span>
                  <ExternalLink size={14} color="#888888" />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function LabelScanResultsScreen() {
  const navigate = useNavigate();
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [scoreVisible, setScoreVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [bannerExpanded, setBannerExpanded] = useState(false);
  const [rawTextExpanded, setRawTextExpanded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setScoreVisible(true), 200); return () => clearTimeout(t); }, []);

  const matched = OCR_INGREDIENTS.filter((i) => i.type === 'matched').length;
  const unidentified = OCR_INGREDIENTS.filter((i) => i.type === 'unidentified').length;
  const corrupted = OCR_INGREDIENTS.filter((i) => i.type === 'corrupted').length;
  const visible = showAll ? OCR_INGREDIENTS : OCR_INGREDIENTS.slice(0, 4);

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#F8F9FA' }}>
      <StatusBar />
      <div className="flex items-center justify-between px-5 py-3 bg-white flex-none" style={{ borderBottom: '1px solid #F0F0F0' }}>
        <button onClick={() => navigate('/scanner')} className="flex items-center gap-1 min-h-[44px]"><ChevronLeft size={20} color="#1A6B3C" /><span className="text-sm font-medium" style={{ color: '#1A6B3C' }}>Scanner</span></button>
        <span className="font-semibold" style={{ fontSize: '16px', color: '#1A1A1A' }}>Label Analysis</span>
        <button className="min-w-[44px] min-h-[44px] flex items-center justify-center"><Share2 size={20} color="#555555" /></button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[210px]">
        <div className="px-5 pt-4 flex flex-col gap-4">

          {/* Section A — Product header (OCR) */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-none" style={{ background: '#F0F7F3' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="16" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#888888', fontStyle: 'italic' }}>Scanned Label</h2>
                <p className="mt-0.5 text-xs" style={{ color: '#AAAAAA' }}>Scanned just now</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#FFF3E0', color: '#E65100' }}>Label Scan</span>
              <span className="text-xs" style={{ color: '#AAAAAA' }}>Powered by on-device OCR</span>
            </div>
          </div>

          {/* Section C — OCR Confidence Banner */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }}>
            <button onClick={() => setBannerExpanded((v) => !v)} className="w-full flex items-center gap-3 px-4 py-3">
              <Info size={16} color="#555555" />
              <span className="flex-1 text-left text-sm" style={{ color: '#555555' }}>Ingredient list extracted from label</span>
              <span className="text-xs font-semibold" style={{ color: '#F4A323' }}>Partial read</span>
            </button>
            <AnimatePresence>
              {bannerExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                  <div className="px-4 pb-3 pt-1">
                    <p className="text-xs leading-relaxed" style={{ color: '#666666' }}>
                      We extracted <strong>{matched + unidentified + corrupted}</strong> ingredients. <strong>{unidentified}</strong> could not be fully identified and are shown as extracted text. <strong>{corrupted}</strong> appear corrupted and are filtered from scoring.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section B — Health Score */}
          <div className="flex flex-col items-center py-4 gap-2">
            {scoreVisible && <HealthScoreRing score={SCORE} size="large" animate showLabel />}
            <p className="text-center text-sm" style={{ color: '#888888' }}>Moderate quality · 2 ingredients unidentified</p>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-2xl px-4 py-3" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold mb-2" style={{ fontSize: '15px', color: '#1A1A1A' }}>Score Breakdown</h3>
            <ScoreBar label="Nutritional Quality" value={BREAKDOWN.nutritional} weight="35%" />
            <ScoreBar label="Ingredient Safety" value={BREAKDOWN.ingredientSafety} weight="30%" />
            <ScoreBar label="Processing Level" value={BREAKDOWN.processingLevel} weight="20%" />
            <ScoreBar label="Personalization" value={BREAKDOWN.personalization} weight="15%" />
          </div>

          {/* Key insights */}
          <div>
            <h3 className="font-semibold mb-2" style={{ fontSize: '15px', color: '#1A1A1A' }}>Key Insights</h3>
            <div className="flex flex-wrap gap-2">{INSIGHTS.map((ins, i) => <InsightChip key={i} type={ins.type} text={ins.text} delay={i * 80} />)}</div>
          </div>

          {/* Section D — Ingredient list (OCR variant) */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#1A1A1A' }}>Ingredients ({OCR_INGREDIENTS.length})</h3>
              <button onClick={() => setShowAll(!showAll)} className="text-sm font-medium" style={{ color: '#1A6B3C' }}>{showAll ? 'Show less ↑' : `See all (${OCR_INGREDIENTS.length}) →`}</button>
            </div>
            {visible.map((ocr, i) => {
              if (ocr.type === 'matched') {
                const { ingredient } = ocr;
                const sc = getSafetyConfig(ingredient.safety);
                return (
                  <button key={ingredient.id} onClick={() => setSelectedIngredient(ingredient)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors" style={{ borderTop: i > 0 ? '1px solid #F0F0F0' : 'none' }}>
                    <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: sc.dot }} />
                    <div className="flex-1 min-w-0"><p className="text-sm truncate" style={{ color: '#1A1A1A' }}>{ingredient.name}</p>{ingredient.eNumber && <p className="text-xs" style={{ color: '#888888' }}>{ingredient.eNumber}</p>}</div>
                    <SafetyBadge safety={ingredient.safety} />
                    <ChevronRight size={16} color="#BBBBBB" />
                  </button>
                );
              }
              if (ocr.type === 'unidentified') {
                return (
                  <div key={ocr.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? '1px solid #F0F0F0' : 'none' }}>
                    <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: '#BBBBBB' }} />
                    <p className="text-sm flex-1 truncate" style={{ color: '#555555', fontFamily: 'Courier, monospace', fontSize: '13px' }}>{ocr.rawText}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-none" style={{ background: '#F0F0F0', color: '#888888' }}>Unidentified</span>
                  </div>
                );
              }
              return (
                <div key={ocr.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? '1px solid #F0F0F0' : 'none' }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: '#E0E0E0' }} />
                  <p className="text-sm flex-1 truncate" style={{ color: '#CCCCCC', textDecoration: 'line-through', fontFamily: 'Courier, monospace', fontSize: '13px' }}>{ocr.corruptedText}</p>
                  <span className="text-xs flex-none" style={{ color: '#CCCCCC' }}>OCR noise</span>
                </div>
              );
            })}
            <div className="px-4 py-3" style={{ borderTop: '1px solid #F0F0F0' }}>
              <button disabled className="text-sm" style={{ color: '#BBBBBB', cursor: 'not-allowed' }}>Incorrect ingredient? Tap to correct →</button>
            </div>
          </div>

          {/* Section E — Raw text (collapsible) */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <button onClick={() => setRawTextExpanded((v) => !v)} className="w-full flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium" style={{ color: '#555555' }}>View raw extracted text</span>
              {rawTextExpanded ? <ChevronUp size={18} color="#AAAAAA" /> : <ChevronDown size={18} color="#AAAAAA" />}
            </button>
            <AnimatePresence>
              {rawTextExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                  <div className="mx-4 mb-4 overflow-y-auto rounded-xl p-3" style={{ maxHeight: '200px', background: '#F5F5F5', border: '1px solid #E8E8E8' }}>
                    <pre style={{ fontSize: '13px', color: '#444444', fontFamily: 'Courier, monospace', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>{EXTRACTED_RAW}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Alternatives */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#1A1A1A' }}>Healthier Alternatives</h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#1A6B3C' }}>{ALTERNATIVES.length} options</span>
            </div>
            <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' } as CSSProperties}>
              {ALTERNATIVES.map((alt) => {
                const diff = alt.score - SCORE;
                const altColor = getScoreColor(alt.score);
                return (
                  <div key={alt.id} className="flex-none bg-white rounded-2xl overflow-hidden" style={{ width: '162px', boxShadow: '0px 3px 14px rgba(0,0,0,0.11)', border: '1px solid #EEEEEE' }}>
                    <div className="relative">
                      <img src={alt.image} alt={alt.name} className="w-full object-cover" style={{ height: '104px', display: 'block' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 50%)' }} />
                      <div className="absolute top-2 right-2 flex items-center justify-center rounded-full" style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.97)', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', border: `2.5px solid ${altColor}` }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: altColor, lineHeight: 1 }}>{alt.score}</span>
                      </div>
                      {diff > 0 && <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(27,94,32,0.88)' }}><span style={{ fontSize: '10px', fontWeight: '700', color: '#fff' }}>↑ +{diff} pts</span></div>}
                    </div>
                    <div className="px-3 pt-2.5 pb-3">
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as CSSProperties}>{alt.name}</p>
                      <p className="mt-0.5" style={{ fontSize: '11px', color: '#888888' }}>{alt.brand}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: '700', background: `${altColor}1A`, color: altColor }}>{alt.score >= 80 ? 'EXCELLENT' : alt.score >= 60 ? 'GOOD' : 'MODERATE'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute left-0 right-0 bg-white px-5 py-3 flex flex-col gap-2" style={{ bottom: '83px', borderTop: '1px solid #F0F0F0', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2" style={{ background: '#E8F5E9' }}>
              <Check size={18} color="#1A6B3C" /><span className="font-semibold" style={{ color: '#1A6B3C', fontSize: '16px' }}>Saved to History</span>
            </motion.div>
          ) : (
            <motion.button key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSaved(true)} className="w-full py-3.5 rounded-xl font-semibold text-white" style={{ background: '#1A6B3C', fontSize: '16px' }} whileTap={{ scale: 0.98 }}>Save Scan</motion.button>
          )}
        </AnimatePresence>
        <button onClick={() => navigate('/scanner')} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium" style={{ border: '1.5px solid #E0E0E0', color: '#555555' }}>
          <RotateCcw size={16} color="#555555" /> Scan Again
        </button>
      </div>

      <TabBar />

      <AnimatePresence>
        {selectedIngredient && <IngredientSheet ingredient={selectedIngredient} onClose={() => setSelectedIngredient(null)} />}
      </AnimatePresence>
    </div>
  );
}
