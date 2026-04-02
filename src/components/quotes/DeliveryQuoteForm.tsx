'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Fuel, 
  Settings, 
  AlertCircle,
  Plus,
  Calculator,
  ChevronRight,
  Info
} from 'lucide-react';
import { calculateDeliveryQuote, DeliveryQuoteInput, DeliveryQuoteResult } from '@/services/quoteCalculators';

interface DeliveryQuoteFormProps {
  clients: { id: string; name: string }[];
  defaultSettings: any;
}

export default function DeliveryQuoteForm({ clients, defaultSettings }: DeliveryQuoteFormProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    origin: '',
    destination: '',
    distance: 0,
    duration: 0,
    fuelConsumption: 8.5, // L/100km default
    fuelPrice: defaultSettings.fuelPriceDefault,
    wearCostPerKm: 0.15,
    hourlyRate: defaultSettings.travelHourlyRate,
    tolls: 0,
    animalCount: 1,
    isHardship: false,
    hardshipSurcharge: 1.2,
    minForfait: 80,
  });

  const [result, setResult] = useState<DeliveryQuoteResult | null>(null);

  // Recalculate whenever form data changes
  useEffect(() => {
    if (formData.distance > 0 || formData.duration > 0) {
      const calcResult = calculateDeliveryQuote(formData);
      setResult(calcResult);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  return (
    <div className="quote-form-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
      {/* Inputs Area */}
      <div className="inputs-section">
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="var(--accent)" />
              Saisie du trajet
            </h3>
          </div>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label">Client</label>
              <select name="clientId" className="input" value={formData.clientId} onChange={handleChange}>
                <option value="">Sélectionner un client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label">Intitulé du devis</label>
              <input type="text" name="title" className="input" placeholder="Ex: Livraison Python Royal Lyon -> Paris" onChange={handleChange} />
            </div>

            <div className="form-field">
              <label className="label">Point de départ</label>
              <input type="text" name="origin" className="input" placeholder="Départ" onChange={handleChange} />
            </div>
            
            <div className="form-field">
              <label className="label">Destination</label>
              <input type="text" name="destination" className="input" placeholder="Arrivée" onChange={handleChange} />
            </div>

            <div className="form-field">
              <label className="label">Distance estimée (km)</label>
              <input type="number" name="distance" value={formData.distance} onChange={handleChange} className="input" />
            </div>

            <div className="form-field">
              <label className="label">Durée estimée (heures)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="input" />
            </div>

            <div className="form-field">
              <label className="label">Péages attendus (€)</label>
              <input type="number" name="tolls" value={formData.tolls} onChange={handleChange} className="input" />
            </div>

            <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <input type="checkbox" name="isHardship" checked={formData.isHardship} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              <label className="label" style={{ marginBottom: 0 }}>Pénibilité (Majoration)</label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="var(--primary)" />
              Paramètres de calcul (Véhicule)
            </h3>
          </div>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
            <div className="form-field">
              <label className="label">Consommation (L/100)</label>
              <input type="number" step="0.1" name="fuelConsumption" value={formData.fuelConsumption} onChange={handleChange} className="input" />
            </div>
            <div className="form-field">
              <label className="label">Prix carburant (€/L)</label>
              <input type="number" step="0.01" name="fuelPrice" value={formData.fuelPrice} onChange={handleChange} className="input" />
            </div>
            <div className="form-field">
              <label className="label">Usure/km (€/km)</label>
              <input type="number" step="0.01" name="wearCostPerKm" value={formData.wearCostPerKm} onChange={handleChange} className="input" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary / Result Area */}
      <div className="summary-section">
        <div className="card" style={{ position: 'sticky', top: '20px', border: '1px solid var(--accent)', background: 'rgba(59, 130, 246, 0.02)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px', fontWeight: 700 }}>Synthèse du calcul</h3>

          {!result ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Calculator size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.8rem' }}>Remplissez les informations de trajet pour voir le devis.</p>
            </div>
          ) : (
            <div className="breakdown-list">
              {result.breakdown.map((item, idx) => (
                <div key={idx} className="breakdown-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500 }}>{item.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                </div>
              ))}
              
              <div className="total-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>TOTAL ESTIMÉ</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)' }}>
                  {result.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>

              <div className="actions" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Générer & Sauvegarder
                </button>
                <button className="btn btn-secondary" style={{ width: '100%', padding: '12px' }}>
                  Aperçu PDF (Print)
                </button>
              </div>
            </div>
          )}

          <div className="info-box" style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
            <Info size={14} style={{ marginTop: '2px' }} />
            <p>Le calcul est effectué dynamiquement selon le moteur de calcul métier factorisé.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .label {
          display: block;
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
