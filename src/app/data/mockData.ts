export interface Ingredient {
  id: string;
  name: string;
  eNumber?: string;
  category: string;
  safety: 'safe' | 'caution' | 'avoid' | 'banned';
  description: string;
  risks: string[];
  benefits: string[];
  regulations: { country: string; flag: string; body: string; status: string; statusColor: string }[];
  research?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  score: number;
  scanMethod: 'Barcode' | 'Label Scan' | 'Manual Entry';
  scanDate: Date;
  image: string;
  ingredients: Ingredient[];
  insights: { type: 'positive' | 'warning' | 'negative'; text: string }[];
  scoreBreakdown: {
    nutritional: number;
    ingredientSafety: number;
    processingLevel: number;
    personalization: number;
  };
  alternatives?: { id: string; name: string; brand: string; score: number; image: string }[];
}

export const ingredients: Ingredient[] = [
  {
    id: 'i1',
    name: 'Whole Grain Oats',
    category: 'Grain / Cereal',
    safety: 'safe',
    description:
      'Whole grain oats are minimally processed cereal grains that retain their bran and germ layers. Rich in beta-glucan fiber, associated with reduced cholesterol and improved cardiovascular health.',
    risks: ['May cause digestive discomfort in large amounts', 'Cross-contamination with gluten possible'],
    benefits: ['High in soluble fiber', 'Supports heart health', 'Provides sustained energy'],
    regulations: [
      { country: 'United States', flag: '🇺🇸', body: 'FDA', status: 'GRAS', statusColor: '#2E7D32' },
      { country: 'European Union', flag: '🇪🇺', body: 'EFSA', status: 'Approved', statusColor: '#2E7D32' },
      { country: 'Australia', flag: '🇦🇺', body: 'FSANZ', status: 'Permitted', statusColor: '#2E7D32' },
      { country: 'Canada', flag: '🇨🇦', body: 'Health Canada', status: 'Approved', statusColor: '#2E7D32' },
    ],
    research: ['PubMed: Beta-glucan and cardiovascular outcomes (2023)', 'PubMed: Oat fiber and glycemic response'],
  },
  {
    id: 'i2',
    name: 'Sugar',
    category: 'Sweetener',
    safety: 'caution',
    description:
      'Refined white sugar (sucrose) extracted from sugarcane or sugar beet. Generally recognised as safe in moderate amounts, but excessive consumption is linked to obesity, dental caries, and metabolic disorders.',
    risks: ['Linked to obesity when over-consumed', 'Promotes dental caries', 'May spike blood glucose'],
    benefits: ['Provides quick energy', 'Enhances palatability'],
    regulations: [
      { country: 'United States', flag: '🇺🇸', body: 'FDA', status: 'GRAS', statusColor: '#2E7D32' },
      { country: 'European Union', flag: '🇪🇺', body: 'EFSA', status: 'Monitored', statusColor: '#FFA726' },
      { country: 'Australia', flag: '🇦🇺', body: 'FSANZ', status: 'Permitted', statusColor: '#2E7D32' },
      { country: 'WHO', flag: '🌍', body: 'WHO', status: 'Limit <10% calories', statusColor: '#FFA726' },
    ],
    research: ['PubMed: Added sugar and metabolic syndrome (2022)'],
  },
  {
    id: 'i3',
    name: 'Modified Starch E1442',
    eNumber: 'E1442',
    category: 'Thickener / Stabiliser',
    safety: 'caution',
    description:
      'Hydroxypropyl distarch phosphate (E1442) is a chemically modified starch used as a thickener and stabilizer. Generally considered safe but derived through chemical treatment.',
    risks: ['Chemical modification raises concerns for some consumers', 'May cause digestive issues in sensitive individuals'],
    benefits: ['Improves texture and shelf stability', 'Withstands freeze-thaw cycles'],
    regulations: [
      { country: 'United States', flag: '🇺🇸', body: 'FDA', status: 'GRAS', statusColor: '#2E7D32' },
      { country: 'European Union', flag: '🇪🇺', body: 'EFSA', status: 'Approved', statusColor: '#2E7D32' },
      { country: 'Australia', flag: '🇦🇺', body: 'FSANZ', status: 'Permitted', statusColor: '#2E7D32' },
    ],
  },
  {
    id: 'i4',
    name: 'Mono and Diglycerides of Fatty Acids',
    eNumber: 'E471',
    category: 'Emulsifier',
    safety: 'caution',
    description:
      'E471 is a common emulsifier used to blend oil and water and improve texture. Recent research has suggested potential links to cardiovascular outcomes when consumed in high quantities.',
    risks: ['Potential cardiovascular concerns with high consumption', 'May contain trans fats', 'Often from palm oil'],
    benefits: ['Improves product texture', 'Extends shelf life', 'Reduces staling in baked goods'],
    regulations: [
      { country: 'United States', flag: '🇺🇸', body: 'FDA', status: 'GRAS', statusColor: '#2E7D32' },
      { country: 'European Union', flag: '🇪🇺', body: 'EFSA', status: 'Under review', statusColor: '#FFA726' },
      { country: 'Australia', flag: '🇦🇺', body: 'FSANZ', status: 'Permitted', statusColor: '#2E7D32' },
      { country: 'Denmark', flag: '🇩🇰', body: 'DVFA', status: 'Restricted', statusColor: '#EF5350' },
    ],
    research: ['PubMed: Emulsifiers and gut microbiome (2023)', 'PubMed: E471 cardiovascular meta-analysis'],
  },
  {
    id: 'i5',
    name: 'Salt',
    category: 'Mineral / Preservative',
    safety: 'caution',
    description:
      'Sodium chloride used for flavour and preservation. Essential in small amounts but excessive intake is associated with hypertension and cardiovascular disease.',
    risks: ['High intake linked to hypertension', 'May worsen kidney disease'],
    benefits: ['Essential electrolyte', 'Natural preservative', 'Enhances flavour'],
    regulations: [
      { country: 'United States', flag: '🇺🇸', body: 'FDA', status: 'GRAS', statusColor: '#2E7D32' },
      { country: 'WHO', flag: '🌍', body: 'WHO', status: 'Limit <5g/day', statusColor: '#FFA726' },
    ],
  },
  {
    id: 'i6',
    name: 'Soy Lecithin',
    eNumber: 'E322',
    category: 'Emulsifier',
    safety: 'safe',
    description:
      'A natural emulsifier derived from soybeans. Widely used to improve texture and prevent separation. Generally well tolerated, though some soy-allergic individuals may react.',
    risks: ['May trigger reactions in soy-allergic individuals', 'Often from GMO soybeans'],
    benefits: ['Natural emulsifier', 'Supports brain health (choline)', 'Well studied safety profile'],
    regulations: [
      { country: 'United States', flag: '🇺🇸', body: 'FDA', status: 'GRAS', statusColor: '#2E7D32' },
      { country: 'European Union', flag: '🇪🇺', body: 'EFSA', status: 'Approved', statusColor: '#2E7D32' },
    ],
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Granola Breakfast Bars with Oats & Honey',
    brand: 'NutriGrain',
    score: 62,
    scanMethod: 'Barcode',
    scanDate: new Date(Date.now() - 1000 * 60 * 5),
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200&q=80',
    ingredients: ingredients,
    insights: [
      { type: 'positive', text: '✓ Whole grain base' },
      { type: 'warning', text: '⚠ Contains E471' },
      { type: 'warning', text: '⚠ Added sugar' },
      { type: 'negative', text: '✗ Ultra-processed' },
    ],
    scoreBreakdown: {
      nutritional: 68,
      ingredientSafety: 55,
      processingLevel: 58,
      personalization: 72,
    },
    alternatives: [
      { id: 'a1', name: 'Organic Rolled Oats with Berries', brand: "Nature's Path", score: 88, image: 'https://images.unsplash.com/photo-1517673408408-f8f5c2a2e9e6?w=200&q=80' },
      { id: 'a2', name: 'Sugar-Free Muesli Bar', brand: 'Dorset Cereals', score: 79, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
      { id: 'a3', name: 'Whole Grain Oat Biscuits', brand: 'Digestive Gold', score: 74, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80' },
    ],
  },
  {
    id: 'p2',
    name: 'Greek Natural Yogurt Full Fat',
    brand: 'Chobani',
    score: 85,
    scanMethod: 'Barcode',
    scanDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80',
    ingredients: [ingredients[0], ingredients[5]],
    insights: [
      { type: 'positive', text: '✓ High protein' },
      { type: 'positive', text: '✓ Live cultures' },
      { type: 'positive', text: '✓ No additives' },
    ],
    scoreBreakdown: { nutritional: 88, ingredientSafety: 90, processingLevel: 80, personalization: 82 },
  },
  {
    id: 'p3',
    name: 'Dark Chocolate 85% Cocoa',
    brand: 'Lindt Excellence',
    score: 74,
    scanMethod: 'Label Scan',
    scanDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&q=80',
    ingredients: [ingredients[1], ingredients[3]],
    insights: [
      { type: 'positive', text: '✓ High cocoa content' },
      { type: 'positive', text: '✓ Antioxidants' },
      { type: 'warning', text: '⚠ Contains E471' },
    ],
    scoreBreakdown: { nutritional: 72, ingredientSafety: 74, processingLevel: 70, personalization: 80 },
  },
];

export const currentProduct = mockProducts[0];

export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#2E7D32';
  if (score >= 60) return '#F57F17';
  if (score >= 40) return '#E65100';
  return '#B71C1C';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Poor';
};

export const getSafetyConfig = (safety: Ingredient['safety']) => {
  const configs = {
    safe: { dot: '#2E7D32', bg: '#E8F5E9', text: '#1B5E20', label: 'Safe' },
    caution: { dot: '#F57F17', bg: '#FFF8E1', text: '#E65100', label: 'Caution' },
    avoid: { dot: '#EF5350', bg: '#FFEBEE', text: '#B71C1C', label: 'Avoid' },
    banned: { dot: '#B71C1C', bg: '#FFEBEE', text: '#7F0000', label: 'Banned' },
  };
  return configs[safety];
};
