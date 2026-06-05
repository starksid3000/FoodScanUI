import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Apple } from 'lucide-react';

const slides = [
  {
    headline: 'Know What\'s In Your Food.',
    body: 'Scan any product and get an instant health score in seconds.',
    illustration: (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        {/* Camera scanning illustration */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Phone outline */}
          <div className="absolute w-32 h-44 rounded-2xl" style={{ border: '3px solid #1A6B3C', background: 'rgba(26,107,60,0.05)' }} />
          {/* Camera lens */}
          <div className="absolute top-6 w-10 h-10 rounded-full" style={{ border: '2px solid #1A6B3C', background: 'rgba(26,107,60,0.1)' }}>
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <div className="w-5 h-5 rounded-full" style={{ background: 'rgba(26,107,60,0.4)' }} />
            </div>
          </div>
          {/* Barcode */}
          <div className="absolute bottom-10 flex gap-0.5">
            {[3,1,2,1,3,2,1,2,3,1,2].map((w, i) => (
              <div key={i} className="h-8 rounded-sm" style={{ width: w * 3, background: '#1A1A1A' }} />
            ))}
          </div>
          {/* Scan beam */}
          <div className="absolute w-24 rounded" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #1A6B3C, transparent)', bottom: '38px', boxShadow: '0 0 8px #1A6B3C' }} />
          {/* Score bubble */}
          <div className="absolute -right-2 top-16 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#1A6B3C', boxShadow: '0 4px 12px rgba(26,107,60,0.4)' }}>
            <span className="text-white text-xs font-bold">74</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    headline: 'Every Ingredient Explained.',
    body: 'We break down what each ingredient does to your body — in plain language.',
    illustration: (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-8">
        {[
          { label: 'Whole Grain Oats', safety: 'safe' as const },
          { label: 'Sugar', safety: 'caution' as const },
          { label: 'Sodium Benzoate E211', safety: 'avoid' as const },
          { label: 'Natural Flavors', safety: 'caution' as const },
        ].map((item, i) => {
          const colors = { safe: { bg: '#E8F5E9', text: '#1B5E20', dot: '#2E7D32', badge: 'Safe' }, caution: { bg: '#FFF8E1', text: '#E65100', dot: '#FFA726', badge: 'Caution' }, avoid: { bg: '#FFEBEE', text: '#B71C1C', dot: '#EF5350', badge: 'Avoid' } };
          const c = colors[item.safety];
          return (
            <div key={i} className="w-full flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.dot }} />
                <span className="text-sm" style={{ color: '#1A1A1A' }}>{item.label}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>{c.badge}</span>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    headline: 'Personalized to Your Health.',
    body: 'Set your allergies, diet type, and health conditions for a score built around you.',
    illustration: (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        {/* Profile circle */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl" style={{ background: '#1A6B3C', boxShadow: '0 8px 24px rgba(26,107,60,0.3)' }}>
          <span className="text-white font-bold">JD</span>
        </div>
        {/* Health icons row */}
        <div className="flex gap-4">
          {[
            { icon: '❤️', label: 'Heart' },
            { icon: '🌿', label: 'Vegan' },
            { icon: '🛡️', label: 'Allergen-free' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                {item.icon}
              </div>
              <span className="text-xs" style={{ color: '#888888' }}>{item.label}</span>
            </div>
          ))}
        </div>
        {/* Alert chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['🥜 Peanuts', '🌾 Gluten', '🦐 Shellfish'].map((a, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#FFEBEE', color: '#B71C1C' }}>{a}</span>
          ))}
        </div>
      </div>
    ),
  },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowCTA(true);
    }
  };

  if (showCTA) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center justify-between w-full h-full bg-white px-6 py-8"
        style={{ paddingTop: '59px' }}
      >
        {/* Logo area */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="w-20 h-20 rounded-[28px] flex items-center justify-center" style={{ background: '#1A6B3C', boxShadow: '0 8px 24px rgba(26,107,60,0.3)' }}>
            <span className="text-3xl">🥦</span>
          </div>
          <div className="text-center">
            <h1 className="font-bold" style={{ fontSize: '28px', color: '#1A1A1A' }}>FoodScan</h1>
            <p className="mt-1 text-sm" style={{ color: '#888888' }}>Know what's in your food</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate('/health-setup')}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ background: '#1A6B3C', fontSize: '16px' }}
          >
            Create Free Account
          </button>
          <button
            onClick={() => navigate('/scanner')}
            className="w-full py-4 rounded-xl font-semibold"
            style={{ border: '2px solid #1A6B3C', color: '#1A6B3C', fontSize: '16px', background: 'transparent' }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/scanner')}
            className="text-center text-sm mt-1"
            style={{ color: '#888888' }}
          >
            Continue without account →
          </button>

          {/* Apple Sign In */}
          <button
            onClick={() => navigate('/scanner')}
            className="w-full mt-2 py-4 rounded-full flex items-center justify-center gap-2 font-semibold text-white"
            style={{ background: '#000000', fontSize: '16px' }}
          >
            <Apple size={18} fill="white" strokeWidth={0} />
            Sign in with Apple
          </button>

          <p className="text-center text-xs mt-2" style={{ color: '#888888' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    );
  }

  const slide = slides[current];

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#F8F9FA', paddingTop: '59px' }}>
      {/* Skip button */}
      {current === 2 && (
        <div className="flex justify-end px-5 pt-2">
          <button onClick={() => setShowCTA(true)} className="text-sm font-medium" style={{ color: '#888888' }}>
            Skip
          </button>
        </div>
      )}
      {current < 2 && <div className="h-8" />}

      {/* Illustration area - top 55% */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="flex-none"
          style={{ height: '320px' }}
        >
          {slide.illustration}
        </motion.div>
      </AnimatePresence>

      {/* Text + dots + button */}
      <div className="flex flex-col flex-1 px-6 pt-4 pb-8 justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3' }}>
              {slide.headline}
            </h2>
            <p className="mt-3" style={{ fontSize: '16px', color: '#555555', lineHeight: '24px' }}>
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-6">
          {/* Page dots */}
          <div className="flex gap-2 justify-center">
            {slides.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '8px',
                  height: '8px',
                  background: i === current ? '#1A6B3C' : '#E0E0E0',
                }}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white"
            style={{ background: '#1A6B3C', fontSize: '16px' }}
          >
            {current < slides.length - 1 ? 'Next' : 'Get Started'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
