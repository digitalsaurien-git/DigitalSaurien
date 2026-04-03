'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Truck, Percent, Save, Info, CheckCircle } from 'lucide-react';
import { SyncControls } from '@/components/settings/SyncControls';

const SETTINGS_KEY = 'digitalsaurien_settings';

const DEFAULT_SETTINGS = {
  hourlyRate: 60,
  travelHourlyRate: 35,
  fuelPriceDefault: 1.85,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setIsDirty(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container-center animate-in" style={{ paddingTop: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
          Paramètres
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Configurez vos taux par défaut et coefficients de calcul · Stockage local
        </p>
      </div>

      {/* Sync Controls */}
      <SyncControls />

      {/* Settings Form */}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>

          {/* Tarification */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <DollarSign size={22} color="var(--accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Tarification Générale</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="label-modern">Taux horaire principal (€/h)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-modern"
                  value={settings.hourlyRate}
                  onChange={e => handleChange('hourlyRate', e.target.value)}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Utilisé pour les prestations IT et la main d'œuvre.
                </p>
              </div>

              <div>
                <label className="label-modern">Taux horaire déplacement (€/h)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-modern"
                  value={settings.travelHourlyRate}
                  onChange={e => handleChange('travelHourlyRate', e.target.value)}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Utilisé pour le temps passé sur la route (Livraison).
                </p>
              </div>
            </div>
          </div>

          {/* Carburant */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Truck size={22} color="var(--accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Logistique & Carburant</h3>
            </div>

            <div>
              <label className="label-modern">Prix carburant par défaut (€/L)</label>
              <input
                type="number"
                step="0.001"
                className="input-modern"
                value={settings.fuelPriceDefault}
                onChange={e => handleChange('fuelPriceDefault', e.target.value)}
              />
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '10px' }}>
              <Info size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Ces valeurs servent de base aux formulaires de devis mais peuvent être ajustées individuellement lors de la saisie.
              </p>
            </div>
          </div>

          {/* Coefficients */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Percent size={22} color="var(--accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Coefficients de Complexité (Logiciel / IA)</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
              {[
                { label: 'Complexité Basse', value: '× 1.0', color: '#10b981' },
                { label: 'Complexité Moyenne', value: '× 1.3', color: '#f59e0b' },
                { label: 'Complexité Haute', value: '× 1.8', color: '#ef4444' },
              ].map(c => (
                <div key={c.label} style={{ textAlign: 'center', padding: '20px', borderRadius: 'var(--radius-md)', background: 'var(--background)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>{c.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckCircle size={18} /> Paramètres sauvegardés !
            </span>
          )}
          <button
            type="submit"
            className="btn-wow"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: 'var(--radius-md)' }}
          >
            <Save size={18} />
            {isDirty ? 'Enregistrer les modifications' : 'Paramètres à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}
