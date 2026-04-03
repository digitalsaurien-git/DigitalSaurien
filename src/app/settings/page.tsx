import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { 
  Settings, 
  DollarSign, 
  Truck, 
  Zap, 
  Percent, 
  Clock, 
  Save,
  Info
} from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { SyncControls } from '@/components/settings/SyncControls';

async function getSettings() {
  try {
    const settings = await prisma.pricingSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      return await prisma.pricingSettings.create({
        data: {
          hourlyRate: 60,
          travelHourlyRate: 35,
          fuelPriceDefault: 1.85,
          complexityCoeffs: JSON.stringify({ basic: 1, medium: 1.3, high: 1.8 }),
          multiToolCoeffs: JSON.stringify({ base: 1.1 }),
          multiIACoeffs: JSON.stringify({ base: 1.25 }),
          riskCoeffs: JSON.stringify({ low: 1, med: 1.2, high: 1.5 }),
          minForfait: 80,
        }
      });
    }
    return settings;
  } catch (error) {
    console.warn("⚠️ [Prisma] Erreur lors de la récupération des paramètres, utilisation du fallback.");
    return {
      id: 'fallback',
      hourlyRate: 60,
      travelHourlyRate: 35,
      fuelPriceDefault: 1.85,
      complexityCoeffs: JSON.stringify({ basic: 1, medium: 1.3, high: 1.8 }),
      multiToolCoeffs: JSON.stringify({ base: 1.1 }),
      multiIACoeffs: JSON.stringify({ base: 1.25 }),
      riskCoeffs: JSON.stringify({ low: 1, med: 1.2, high: 1.5 }),
      minForfait: 80,
    } as any;
  }
}

async function updateSettings(formData: FormData) {
  'use server';
  
  const id = formData.get('id') as string;
  const hourlyRate = parseFloat(formData.get('hourlyRate') as string);
  const travelHourlyRate = parseFloat(formData.get('travelHourlyRate') as string);
  const fuelPriceDefault = parseFloat(formData.get('fuelPriceDefault') as string);

  await prisma.pricingSettings.update({
    where: { id },
    data: {
      hourlyRate,
      travelHourlyRate,
      fuelPriceDefault
    }
  });

  revalidatePath('/settings');
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="settings-container">
      <div className="section-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="page-title">Paramètres</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configurez vos taux par défaut et coefficients de calcul.</p>
      </div>

      {/* Synchronisation Google Drive */}
      <SyncControls />

      <form action={updateSettings} className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-xl)' }}>
        <input type="hidden" name="id" value={settings.id} />
        
        {/* General Pricing */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--spacing-lg)' }}>
            <DollarSign size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1rem' }}>Tarification Générale</h3>
          </div>
          
          <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="label">Taux horaire principal (€/h)</label>
            <input type="number" step="0.01" name="hourlyRate" defaultValue={settings.hourlyRate} className="input" />
            <p className="hint">Utilisé pour les prestations IT et la main d'œuvre.</p>
          </div>

          <div className="form-group">
            <label className="label">Taux horaire déplacement (€/h)</label>
            <input type="number" step="0.01" name="travelHourlyRate" defaultValue={settings.travelHourlyRate} className="input" />
            <p className="hint">Utilisé pour le temps passé sur la route (Livraison).</p>
          </div>
        </div>

        {/* Vehicle & Fuel */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--spacing-lg)' }}>
            <Truck size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1rem' }}>Logistique & Carburant</h3>
          </div>
          
          <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="label">Prix carburant par défaut (€/L)</label>
            <input type="number" step="0.001" name="fuelPriceDefault" defaultValue={settings.fuelPriceDefault} className="input" />
          </div>

          <div className="info-box" style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px', marginTop: '12px' }}>
            <Info size={18} color="#0369a1" />
            <p style={{ fontSize: '0.75rem', color: '#0369a1' }}>
              Ces valeurs servent de base aux formulaires de devis mais peuvent être ajustées individuellement lors de la saisie.
            </p>
          </div>
        </div>

        {/* Automation Coeffs (Static Display for now) */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--spacing-lg)' }}>
            <Percent size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1rem' }}>Coefficients de Complexité (Logiciel/IA)</h3>
          </div>
          
          <div className="coeffs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
            <div className="coeff-item">
              <span className="label">Complexité Basse</span>
              <div className="coeff-value">× 1.0</div>
            </div>
            <div className="coeff-item">
              <span className="label">Complexité Moyenne</span>
              <div className="coeff-value">× 1.3</div>
            </div>
            <div className="coeff-item">
              <span className="label">Complexité Haute</span>
              <div className="coeff-value">× 1.8</div>
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            Mettre à jour les paramètres
          </button>
        </div>
      </form>

    </div>
  );
}
