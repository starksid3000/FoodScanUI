import { currentProduct, getSafetyConfig, getScoreColor } from '../data/mockData';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share2, ChevronRight, X, ExternalLink, BookOpen, Globe, Check } from 'lucide-react';
import { HealthScoreRing } from '../components/HealthScoreRing';
import { SafetyBadge } from '../components/SafetyBadge';
import { TabBar } from '../components/TabBar';
import { StatusBar } from '../components/StatusBar';
import type { Ingredient } from '../data/mockData';
import type { CSSProperties } from 'react';

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 300); return () => clearTimeout(t); }, [value]);
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

function IngredientDetailSheet({ ingredient, onClose }: { ingredient: Ingredient; onClose: () => void }) {
  const safetyConfig = getSafetyConfig(ingredient.safety);
  const [expanded, setExpanded] = useState(false);
  const bannerBg = ingredient.safety === 'safe' ? '#E8F5E9' : ingredient.safety === 'caution' ? '#FFF8E1' : '#FFEBEE';
  const bannerText = ingredient.safety === 'safe' ? '#1B5E20' : ingredient.safety === 'caution' ? '#E65100' : '#B71C1C';
  const bannerMsg = ingredient.safety === 'safe' ? 'Generally Recognised as Safe (FDA)' : ingredient.safety === 'caution' ? 'Use with caution — monitor intake levels' : 'Avoid — restricted or banned in some regions';

  return (
    <motion.div className="absolute inset-0 z-50 flex flex-col justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        className="relative rounded-t-[40px] flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0px 8px 24px rgba(0,0,0,0.14)', height: expanded ? '92%' : '58%', transition: 'height 350ms cubic-bezier(0.34, 1.20, 0.64, 1)' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <button onClick={() => setExpanded(!expanded)} className="flex flex-col items-center pt-3 pb-2 w-full flex-none">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E0E0E0' }} />
          <span className="text-[10px] mt-1" style={{ color: '#BBBBBB' }}>{expanded ? 'Collapse ↓' : 'Expand ↑'}</span>
        </button>
        <button onClick={onClose} className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full" style={{ background: '#F5F5F5' }}>
          <X size={16} color="#555" />
        </button>
        <div className="overflow-y-auto px-5 pb-8 flex-1">
          <div className="flex items-start gap-3 pt-2 pb-1">
            <div className="flex-1">
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3' }}>{ingredient.name}</h1>
              <p className="mt-0.5 text-xs uppercase tracking-wide font-medium" style={{ color: '#888888' }}>{ingredient.category}</p>
            </div>
            {ingredient.eNumber && <span className="px-2.5 py-1 rounded-full text-sm font-semibold mt-1" style={{ background: '#F0F0F0', color: '#555555' }}>{ingredient.eNumber}</span>}
          </div>
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl mt-3" style={{ background: bannerBg }}>
            <div className="w-2 h-2 rounded-full flex-none" style={{ background: safetyConfig.dot }} />
            <span className="text-sm font-semibold" style={{ color: bannerText }}>{bannerMsg}</span>
          </div>
          <p className="mt-4 leading-relaxed" style={{ fontSize: '15px', color: '#555555', lineHeight: '24px' }}>{ingredient.description}</p>
          <div className="mt-5">
            <h3 className="font-semibold mb-3" style={{ fontSize: '16px', color: '#1A1A1A' }}>Health Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: '#FFEBEE' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#B71C1C' }}>⚠ Potential Risks</p>
                {ingredient.risks.map((r, i) => <p key={i} className="text-xs mb-1" style={{ color: '#555555' }}>• {r}</p>)}
              </div>
              <div className="rounded-xl p-3" style={{ background: '#E8F5E9' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#1B5E20' }}>✓ Potential Benefits</p>
                {ingredient.benefits.map((b, i) => <p key={i} className="text-xs mb-1" style={{ color: '#555555' }}>• {b}</p>)}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontSize: '16px', color: '#1A1A1A' }}>
              <Globe size={16} color="#1A6B3C" /> Regulation by Country
            </h3>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #F0F0F0' }}>
              {ingredient.regulations.map((reg, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: i < ingredient.regulations.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <span className="text-base">{reg.flag}</span>
                  <span className="flex-1 text-sm" style={{ color: '#1A1A1A' }}>{reg.country}</span>
                  <span className="text-xs" style={{ color: '#888888' }}>{reg.body}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${reg.statusColor}20`, color: reg.statusColor }}>{reg.status}</span>
                </div>
              ))}
            </div>
          </div>
          {ingredient.research && ingredient.research.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontSize: '16px', color: '#1A1A1A' }}>
                <BookOpen size={16} color="#1A6B3C" /> Research
              </h3>
              <div className="flex flex-col gap-2">
                {ingredient.research.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#F8F9FA', border: '1px solid #E8E8E8' }}>
                    <BookOpen size={14} color="#888888" />
                    <span className="text-sm flex-1 truncate" style={{ color: '#555555' }}>{r}</span>
                    <ExternalLink size={14} color="#888888" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScanResultsScreen() {
  const navigate = useNavigate();
  const product = currentProduct;
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [scoreVisible, setScoreVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { const t = setTimeout(() => setScoreVisible(true), 200); return () => clearTimeout(t); }, []);

  const visible = showAll ? product.ingredients : product.ingredients.slice(0, 3);

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#F8F9FA' }}>
      <StatusBar />
      <div className="flex items-center justify-between px-5 py-3 bg-white flex-none" style={{ borderBottom: '1px solid #F0F0F0' }}>
        <button onClick={() => navigate('/scanner')} className="flex items-center gap-1 min-h-[44px]">
          <ChevronLeft size={20} color="#1A6B3C" />
          <span className="text-sm font-medium" style={{ color: '#1A6B3C' }}>Scanner</span>
        </button>
        <span className="font-semibold" style={{ fontSize: '16px', color: '#1A1A1A' }}>Analysis</span>
        <button className="min-w-[44px] min-h-[44px] flex items-center justify-center"><Share2 size={20} color="#555555" /></button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[180px]">
        <div className="px-5 pt-4 flex flex-col gap-4">
          {/* Product header */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-start gap-3">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-none" style={{ background: '#F0F0F0' }} />
              <div className="flex-1 min-w-0">
                <h2 className="leading-tight line-clamp-2" style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A' }}>{product.name}</h2>
                <p className="mt-0.5 text-sm" style={{ color: '#888888' }}>{product.brand}</p>
                <p className="mt-0.5 text-xs" style={{ color: '#888888' }}>Scanned just now</p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F0F0F0', color: '#555555' }}>{product.scanMethod}</span>
            </div>
          </div>

          {/* Health score */}
          <div className="flex flex-col items-center py-4 gap-2">
            {scoreVisible && <HealthScoreRing score={product.score} size="large" animate showLabel />}
            <p className="text-center text-sm" style={{ color: '#888888' }}>Moderate nutritional quality · Contains E471</p>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-2xl px-4 py-3" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold mb-2" style={{ fontSize: '15px', color: '#1A1A1A' }}>Score Breakdown</h3>
            <ScoreBar label="Nutritional Quality" value={product.scoreBreakdown.nutritional} weight="35%" />
            <ScoreBar label="Ingredient Safety" value={product.scoreBreakdown.ingredientSafety} weight="30%" />
            <ScoreBar label="Processing Level" value={product.scoreBreakdown.processingLevel} weight="20%" />
            <ScoreBar label="Personalization" value={product.scoreBreakdown.personalization} weight="15%" />
          </div>

          {/* Key insights */}
          <div>
            <h3 className="font-semibold mb-2" style={{ fontSize: '15px', color: '#1A1A1A' }}>Key Insights</h3>
            <div className="flex flex-wrap gap-2">
              {product.insights.map((ins, i) => <InsightChip key={i} type={ins.type} text={ins.text} delay={i * 80} />)}
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#1A1A1A' }}>Ingredients ({product.ingredients.length})</h3>
              <button onClick={() => setShowAll(!showAll)} className="text-sm font-medium" style={{ color: '#1A6B3C' }}>
                {showAll ? 'Show less ↑' : `See all (${product.ingredients.length}) →`}
              </button>
            </div>
            {visible.map((ing, i) => {
              const sc = getSafetyConfig(ing.safety);
              return (
                <button key={ing.id} onClick={() => setSelectedIngredient(ing)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors" style={{ borderTop: i > 0 ? '1px solid #F0F0F0' : 'none' }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: sc.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: '#1A1A1A' }}>{ing.name}</p>
                    {ing.eNumber && <p className="text-xs" style={{ color: '#888888' }}>{ing.eNumber}</p>}
                  </div>
                  <SafetyBadge safety={ing.safety} />
                  <ChevronRight size={16} color="#BBBBBB" />
                </button>
              );
            })}
          </div>

          {/* Alternatives */}
          {product.alternatives && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ fontSize: '15px', color: '#1A1A1A' }}>Healthier Alternatives</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#1A6B3C' }}>{product.alternatives.length} options</span>
              </div>
              <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' } as CSSProperties}>
                {product.alternatives.map((alt) => {
                  const diff = alt.score - product.score;
                  const altColor = getScoreColor(alt.score);
                  return (
                    <div key={alt.id} className="flex-none bg-white rounded-2xl overflow-hidden" style={{ width: '162px', boxShadow: '0px 3px 14px rgba(0,0,0,0.11)', border: '1px solid #EEEEEE' }}>
                      <div className="relative">
                        <img src={alt.image} alt={alt.name} className="w-full object-cover" style={{ height: '104px', display: 'block' }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 50%)' }} />
                        <div className="absolute top-2 right-2 flex items-center justify-center rounded-full" style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.97)', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', border: `2.5px solid ${altColor}` }}>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: altColor, lineHeight: 1 }}>{alt.score}</span>
                        </div>
                        {diff > 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(27,94,32,0.88)' }}>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff' }}>↑ +{diff} pts</span>
                          </div>
                        )}
                      </div>
                      <div className="px-3 pt-2.5 pb-3">
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as CSSProperties}>{alt.name}</p>
                        <p className="mt-0.5" style={{ fontSize: '11px', color: '#888888' }}>{alt.brand}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: '700', background: `${altColor}1A`, color: altColor }}>
                          {alt.score >= 80 ? 'EXCELLENT' : alt.score >= 60 ? 'GOOD' : 'MODERATE'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute left-0 right-0 bg-white px-5 py-3" style={{ bottom: '83px', borderTop: '1px solid #F0F0F0', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full py-4 rounded-xl flex items-center justify-center gap-2" style={{ background: '#E8F5E9' }}>
              <Check size={18} color="#1A6B3C" />
              <span className="font-semibold" style={{ color: '#1A6B3C', fontSize: '16px' }}>Saved to History</span>
            </motion.div>
          ) : (
            <motion.button key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSaved(true)} className="w-full py-4 rounded-xl font-semibold text-white" style={{ background: '#1A6B3C', fontSize: '16px' }} whileTap={{ scale: 0.98 }}>
              Save to History
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <TabBar />

      <AnimatePresence>
        {selectedIngredient && (
          <IngredientDetailSheet ingredient={selectedIngredient} onClose={() => setSelectedIngredient(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
