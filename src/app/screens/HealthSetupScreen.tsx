import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { StatusBar } from '../components/StatusBar';

const dietOptions = [
  { emoji: '🍽️', name: 'None' },
  { emoji: '🌱', name: 'Vegan' },
  { emoji: '🥗', name: 'Vegetarian' },
  { emoji: '🥩', name: 'Keto' },
  { emoji: '☪️', name: 'Halal' },
  { emoji: '✡️', name: 'Kosher' },
  { emoji: '🌾', name: 'Gluten-Free' },
  { emoji: '🦴', name: 'Paleo' },
];

const majorAllergens = [
  { id: 'peanuts', emoji: '🥜', name: 'Peanuts', desc: 'Groundnuts and peanut-derived products' },
  { id: 'treenuts', emoji: '🌰', name: 'Tree Nuts', desc: 'Almonds, cashews, walnuts, etc.' },
  { id: 'milk', emoji: '🥛', name: 'Milk / Dairy', desc: 'Cow\'s milk and dairy products' },
  { id: 'eggs', emoji: '🥚', name: 'Eggs', desc: 'Chicken eggs and egg-derived products' },
  { id: 'wheat', emoji: '🌾', name: 'Wheat / Gluten', desc: 'Wheat, rye, barley' },
  { id: 'soy', emoji: '🫘', name: 'Soy', desc: 'Soybeans and soy-derived ingredients' },
  { id: 'fish', emoji: '🐟', name: 'Fish', desc: 'Finfish species' },
  { id: 'shellfish', emoji: '🦐', name: 'Shellfish', desc: 'Shrimp, lobster, crab, etc.' },
];

const otherAllergens = [
  { id: 'sesame', emoji: '🌻', name: 'Sesame', desc: 'Seeds and sesame oil' },
  { id: 'mustard', emoji: '🌿', name: 'Mustard', desc: 'Seeds, leaves, flour' },
  { id: 'sulfites', emoji: '🍷', name: 'Sulphites', desc: 'SO₂ and sulfiting agents' },
  { id: 'lupin', emoji: '🌼', name: 'Lupin', desc: 'Lupin flour and seeds' },
];

const healthConditions = [
  { id: 'diabetes2', name: 'Diabetes Type 2', desc: 'Monitors sugar and carbohydrate content' },
  { id: 'diabetes1', name: 'Diabetes Type 1', desc: 'Insulin-dependent monitoring' },
  { id: 'hypertension', name: 'Hypertension', desc: 'Flags high sodium content' },
  { id: 'celiac', name: 'Celiac Disease', desc: 'Strict gluten avoidance required' },
  { id: 'heart', name: 'Heart Disease', desc: 'Saturated fat and cholesterol monitoring' },
  { id: 'kidney', name: 'Kidney Disease', desc: 'Phosphorus, potassium, sodium limits' },
  { id: 'pregnant', name: 'Pregnant', desc: 'Listeria risk, caffeine limits, folate tracking' },
  { id: 'nursing', name: 'Nursing', desc: 'Nutritional needs and food safety' },
];

export default function HealthSetupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDiet, setSelectedDiet] = useState('None');
  const [enabledAllergens, setEnabledAllergens] = useState<string[]>([]);
  const [enabledConditions, setEnabledConditions] = useState<string[]>([]);

  const toggleAllergen = (id: string) => {
    setEnabledAllergens((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleCondition = (id: string) => {
    setEnabledConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/scanner');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const stepTitles = ['Dietary Preference', 'Allergens', 'Health Conditions', 'Your Profile is Ready'];

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#F8F9FA' }}>
      <StatusBar />

      {/* Nav */}
      <div className="flex items-center gap-4 px-5 py-3 bg-white" style={{ borderBottom: '1px solid #F0F0F0' }}>
        <button onClick={handleBack} className="min-w-[44px] min-h-[44px] flex items-center">
          <ChevronLeft size={22} color="#1A6B3C" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: '#888888' }}>Step {step} of 4</p>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#E0E0E0' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%`, background: '#1A6B3C' }}
            />
          </div>
        </div>
        <button onClick={() => navigate('/scanner')} className="text-sm min-h-[44px] min-w-[44px] flex items-center justify-end" style={{ color: '#888888' }}>
          Skip
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-5 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="mb-4" style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A' }}>
                {stepTitles[step - 1]}
              </h2>

              {/* Step 1 — Dietary Preference */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {dietOptions.map((opt) => {
                    const selected = selectedDiet === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => setSelectedDiet(opt.name)}
                        className="relative flex flex-col items-center justify-center py-5 rounded-2xl transition-all"
                        style={{
                          background: selected ? '#E8F5E9' : '#FFFFFF',
                          border: selected ? '2px solid #1A6B3C' : '2px solid #F0F0F0',
                          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
                        }}
                      >
                        {selected && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: '#1A6B3C' }}
                          >
                            <Check size={11} color="white" strokeWidth={3} />
                          </div>
                        )}
                        <span className="text-3xl mb-2">{opt.emoji}</span>
                        <span className="text-sm font-medium" style={{ color: selected ? '#1A6B3C' : '#1A1A1A' }}>
                          {opt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 2 — Allergens */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  {/* Search bar */}
                  <div className="flex items-center gap-2 px-4 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', height: '48px' }}>
                    <span className="text-gray-400">🔍</span>
                    <input className="flex-1 outline-none bg-transparent text-sm" placeholder="Search allergens..." style={{ color: '#1A1A1A' }} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888888' }}>Major Allergens</p>
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }}>
                      {majorAllergens.map((a, i) => (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? '1px solid #F5F5F5' : 'none' }}>
                          <span className="text-xl flex-none">{a.emoji}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{a.name}</p>
                            <p className="text-xs" style={{ color: '#888888' }}>{a.desc}</p>
                          </div>
                          <Switch
                            checked={enabledAllergens.includes(a.id)}
                            onCheckedChange={() => toggleAllergen(a.id)}
                            className="data-[state=checked]:bg-[#1A6B3C]"
                            style={{ '--switch-background': enabledAllergens.includes(a.id) ? '#1A6B3C' : undefined } as React.CSSProperties}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888888' }}>Other</p>
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }}>
                      {otherAllergens.map((a, i) => (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? '1px solid #F5F5F5' : 'none' }}>
                          <span className="text-xl flex-none">{a.emoji}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{a.name}</p>
                            <p className="text-xs" style={{ color: '#888888' }}>{a.desc}</p>
                          </div>
                          <Switch
                            checked={enabledAllergens.includes(a.id)}
                            onCheckedChange={() => toggleAllergen(a.id)}
                            className="data-[state=checked]:bg-[#1A6B3C]"
                          />
                        </div>
                      ))}
                      <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: '1px solid #F5F5F5' }}>
                        <span className="text-xl flex-none">➕</span>
                        <p className="text-sm font-medium" style={{ color: '#1A6B3C' }}>Add Custom Allergen</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Health Conditions */}
              {step === 3 && (
                <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }}>
                  {healthConditions.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3.5" style={{ borderTop: i > 0 ? '1px solid #F5F5F5' : 'none' }}>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{c.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#888888' }}>{c.desc}</p>
                      </div>
                      <Switch
                        checked={enabledConditions.includes(c.id)}
                        onCheckedChange={() => toggleCondition(c.id)}
                        className="data-[state=checked]:bg-[#1A6B3C]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4 — Summary */}
              {step === 4 && (
                <div className="flex flex-col gap-4">
                  <div
                    className="flex flex-col items-center py-6 rounded-2xl gap-3"
                    style={{ background: '#E8F5E9' }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: '#1A6B3C' }}
                    >
                      <Check size={30} color="white" strokeWidth={3} />
                    </div>
                    <p className="font-semibold" style={{ fontSize: '18px', color: '#1A6B3C' }}>Profile Complete!</p>
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <p className="text-sm font-semibold" style={{ color: '#888888' }}>YOUR SELECTIONS</p>
                    </div>
                    <div className="px-4 py-3.5 flex items-center" style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <span className="text-sm flex-1" style={{ color: '#555555' }}>Dietary Preference</span>
                      <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{selectedDiet}</span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center" style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <span className="text-sm flex-1" style={{ color: '#555555' }}>Allergens</span>
                      <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                        {enabledAllergens.length === 0 ? 'None' : `${enabledAllergens.length} selected`}
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center">
                      <span className="text-sm flex-1" style={{ color: '#555555' }}>Health Conditions</span>
                      <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                        {enabledConditions.length === 0 ? 'None' : `${enabledConditions.length} selected`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-center" style={{ color: '#888888' }}>
                    You can update these settings at any time in your Profile.
                  </p>

                  <button
                    onClick={() => navigate('/scanner')}
                    className="text-center text-sm font-medium"
                    style={{ color: '#888888' }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-5 pb-8 pt-3" style={{ background: '#F8F9FA', borderTop: '1px solid #F0F0F0' }}>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-semibold text-white"
          style={{ background: '#1A6B3C', fontSize: '16px' }}
        >
          {step < 4 ? 'Continue' : 'Start Scanning'}
        </button>
      </div>
    </div>
  );
}