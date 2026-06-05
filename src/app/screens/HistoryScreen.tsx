import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Search, Filter } from 'lucide-react';
import { mockProducts, getScoreColor } from '../data/mockData';
import { HealthScoreRing } from '../components/HealthScoreRing';
import { TabBar } from '../components/TabBar';
import { StatusBar } from '../components/StatusBar';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockProducts);
  const [search, setSearch] = useState('');

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const deleteItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#F8F9FA' }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-2 pb-3 bg-white flex-none" style={{ borderBottom: '1px solid #F0F0F0' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A' }}>Scan History</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: '#F5F5F5' }}>
            <Filter size={18} color="#555555" />
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 px-3 rounded-xl" style={{ background: '#F5F5F5', height: '40px' }}>
          <Search size={16} color="#AAAAAA" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scanned products…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#1A1A1A' }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-[100px] pt-3 px-5 flex flex-col gap-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <span style={{ fontSize: '32px' }}>🔍</span>
              <p className="text-sm" style={{ color: '#AAAAAA' }}>No products found</p>
            </div>
          ) : (
            filtered.map((product) => {
              const scoreColor = getScoreColor(product.score);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.22 }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3"
                  style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}
                >
                  {/* Product image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover flex-none"
                    style={{ background: '#F0F0F0' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>{product.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#888888' }}>{product.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#555555' }}>{product.scanMethod}</span>
                      <span className="text-xs" style={{ color: '#AAAAAA' }}>{formatTime(product.scanDate)}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center gap-2 flex-none">
                    <HealthScoreRing score={product.score} size="small" />
                    <button
                      onClick={() => deleteItem(product.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full"
                      style={{ background: '#FFF5F5' }}
                    >
                      <Trash2 size={14} color="#EF5350" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {filtered.length > 0 && (
          <p className="text-center text-xs py-2" style={{ color: '#CCCCCC' }}>
            {filtered.length} scan{filtered.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>

      {/* Scan button */}
      <div className="absolute left-5 right-5 bg-white rounded-2xl px-5 py-3" style={{ bottom: '95px', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0' }}>
        <button
          onClick={() => navigate('/scanner')}
          className="w-full py-3.5 rounded-xl font-semibold text-white"
          style={{ background: '#1A6B3C', fontSize: '15px' }}
        >
          + Scan New Product
        </button>
      </div>

      <TabBar />
    </div>
  );
}
