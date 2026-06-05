import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, X, Plus } from 'lucide-react';
import { TabBar } from '../components/TabBar';
import { StatusBar } from '../components/StatusBar';

const allergens = ['🥜 Peanuts', '🌾 Gluten', '🦐 Shellfish'];

function SettingsRow({ icon, label, value, destructive = false }: { icon: string; label: string; value?: string; destructive?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ minHeight: '54px' }}>
      {!destructive && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-none" style={{ background: '#E8F5E9' }}>
          <span className="text-base">{icon}</span>
        </div>
      )}
      <span
        className="flex-1 text-sm font-medium"
        style={{ color: destructive ? '#EF5350' : '#1A1A1A', paddingLeft: destructive ? '8px' : '0' }}
      >
        {label}
      </span>
      {value && <span className="text-sm" style={{ color: '#888888' }}>{value}</span>}
      {!destructive && <ChevronRight size={16} color="#BBBBBB" />}
    </div>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [activeAllergens, setActiveAllergens] = useState(allergens);
  const [editMode, setEditMode] = useState(false);

  const removeAllergen = (allergen: string) => {
    setActiveAllergens(activeAllergens.filter((a) => a !== allergen));
  };

  return (
    <div className="flex flex-col w-full h-full" style={{ background: '#F8F9FA' }}>
      <StatusBar />

      {/* Nav bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white" style={{ borderBottom: '1px solid #F0F0F0' }}>
        <div className="w-10" />
        <h1 className="font-semibold" style={{ fontSize: '18px', color: '#1A1A1A' }}>My Profile</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm font-medium min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ color: '#1A6B3C' }}
        >
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[83px]">
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* User card */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-none"
                style={{ background: '#1A6B3C' }}
              >
                <span className="text-white font-bold" style={{ fontSize: '20px' }}>JD</span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold" style={{ fontSize: '20px', color: '#1A1A1A' }}>Jordan Davies</h2>
                <p className="text-sm" style={{ color: '#888888' }}>jordan@example.com</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #F5F5F5' }}>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: '#F4A323' }}>
                ⭐ Free Plan
              </span>
              <button className="text-sm font-semibold" style={{ color: '#F4A323' }}>
                Upgrade to Premium →
              </button>
            </div>
          </div>

          {/* Health profile */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #F5F5F5' }}>
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#1A1A1A' }}>Health Profile</h3>
            </div>
            <SettingsRow icon="🥗" label="Dietary Preference" value="Vegan" />
            <div style={{ height: '1px', background: '#F5F5F5', marginLeft: '56px' }} />
            <SettingsRow icon="⚠️" label="Allergies" value="3 active" />
            <div style={{ height: '1px', background: '#F5F5F5', marginLeft: '56px' }} />
            <SettingsRow icon="🩺" label="Health Conditions" value="None" />
            <div style={{ height: '1px', background: '#F5F5F5', marginLeft: '56px' }} />
            <SettingsRow icon="👤" label="Life Stage" value="Adult" />
            <div style={{ height: '1px', background: '#F5F5F5', marginLeft: '56px' }} />
            <SettingsRow icon="🌍" label="Country" value="United States" />
          </div>

          {/* Allergen chips */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold mb-3" style={{ fontSize: '15px', color: '#1A1A1A' }}>Allergen Alerts</h3>
            <div className="flex flex-wrap gap-2">
              {activeAllergens.map((allergen) => (
                <div
                  key={allergen}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                  style={{ background: '#FFEBEE', border: '1px solid #FFCDD2' }}
                >
                  <span className="text-sm font-medium" style={{ color: '#B71C1C' }}>{allergen}</span>
                  {editMode && (
                    <button onClick={() => removeAllergen(allergen)} className="ml-0.5">
                      <X size={12} color="#B71C1C" />
                    </button>
                  )}
                </div>
              ))}
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ border: '1.5px dashed #BBBBBB', color: '#888888' }}
              >
                <Plus size={14} color="#888888" />
                <span className="text-sm font-medium">Add allergen</span>
              </button>
            </div>
          </div>

          {/* App settings */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #F5F5F5' }}>
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#1A1A1A' }}>App Settings</h3>
            </div>
            <SettingsRow icon="🔔" label="Notification Preferences" />
            <div style={{ height: '1px', background: '#F5F5F5', marginLeft: '56px' }} />
            <SettingsRow icon="🌐" label="Default Country" value="US" />
            <div style={{ height: '1px', background: '#F5F5F5', marginLeft: '56px' }} />
            <SettingsRow icon="🔒" label="Data & Privacy" />
            <div style={{ height: '1px', background: '#F5F5F5' }} />
            <SettingsRow icon="" label="Delete Account" destructive />
          </div>

          {/* Allergen alert demo */}
          <button
            onClick={() => navigate('/allergen-alert')}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm"
            style={{ background: '#FFEBEE', color: '#B71C1C', border: '1px solid #FFCDD2' }}
          >
            ⚠ Preview Allergen Alert
          </button>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
