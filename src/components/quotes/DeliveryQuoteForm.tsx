'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Fuel, 
  Settings, 
  Calculator,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Navigation,
  DollarSign
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
    fuelConsumption: 8.5,
    fuelPrice: defaultSettings.fuelPriceDefault || 1.85,
    wearCostPerKm: 0.15,
    hourlyRate: defaultSettings.travelHourlyRate || 35.0,
    tolls: 0,
    animalCount: 1,
    isHardship: false,
    hardshipSurcharge: 1.2,
    minForfait: 80,
    vehicleKm: 0,
  });

  const [result, setResult] = useState<DeliveryQuoteResult | null>(null);

  useEffect(() => {
    if (formData.distance > 0 || formData.duration > 0) {
      const calcInput: DeliveryQuoteInput = {
        ...formData,
        fuelPrice: Number(formData.fuelPrice),
        hourlyRate: Number(formData.hourlyRate)
      };
      const calcResult = calculateDeliveryQuote(calcInput);
      setResult(calcResult);
    } else {
      setResult(null);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    let parsedValue: any;
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else {
      parsedValue = value;
    }

    if (name === 'vehicleKm') {
      const km = parsedValue;
      // Pour chaque 5000 km, on rajoute 0.15€ (selon instruction utilisateur)
      const wear = 0.15 + (Math.floor(km / 5000) * 0.15);
      setFormData(prev => ({
        ...prev,
        vehicleKm: km,
        wearCostPerKm: parseFloat(wear.toFixed(2))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    }
  };

  return (
    <div className="container-center animate-in">
      <div className="quote-form-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--spacing-xl)', alignItems: 'start', marginTop: 'var(--spacing-lg)' }}>
        {/* Inputs Area */}
        <div className="inputs-section">
          <div className="card shadow-glass" style={{ marginBottom: 'var(--spacing-lg)', borderTop: '4px solid var(--accent)' }}>
            <div className="card-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Navigation size={24} color="var(--accent)" />
                Logistique du Transport
              </h3>
            </div>
            
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
              <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
                <label className="label-modern">Client / Partenaire</label>
                <select name="clientId" className="input-modern" value={formData.clientId} onChange={handleChange}>
                  <option value="">Sélectionner un expéditeur...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
                <label className="label-modern">Titre de la mission</label>
                <input type="text" name="title" className="input-modern" placeholder="Ex: Livraison Lyon -> Paris" onChange={handleChange} />
              </div>

              <div className="form-field">
                <label className="label-modern">Départ</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#10b981' }} />
                  <input type="text" name="origin" className="input-modern" placeholder="Ville" onChange={handleChange} style={{ paddingLeft: '44px' }} />
                </div>
              </div>
              
              <div className="form-field">
                <label className="label-modern">Arrivée</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#ef4444' }} />
                  <input type="text" name="destination" className="input-modern" placeholder="Ville" onChange={handleChange} style={{ paddingLeft: '44px' }} />
                </div>
              </div>

              <div className="form-field">
                <label className="label-modern">Distance (km)</label>
                <input type="number" name="distance" value={formData.distance || ''} onChange={handleChange} className="input-modern" placeholder="0" />
              </div>

              <div className="form-field">
                <label className="label-modern">Durée (h)</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input type="number" name="duration" value={formData.duration || ''} onChange={handleChange} className="input-modern" placeholder="0" step="0.5" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              <div className="form-field">
                <label className="label-modern">Péages (€)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input type="number" name="tolls" value={formData.tolls || ''} onChange={handleChange} className="input-modern" placeholder="0" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              <div className="checkbox-field" style={{ background: formData.isHardship ? 'var(--accent-soft)' : 'transparent', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', alignSelf: 'end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" name="isHardship" checked={formData.isHardship} onChange={handleChange} />
                  <div>
                     <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Majoration Nuit/WE</div>
                     <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Applique {formData.hardshipSurcharge}x</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="card shadow-glass">
            <div className="card-header" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Fuel size={20} color="var(--accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Frais Véhicule</h3>
            </div>
            
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)' }}>
              <div className="form-field">
                <label className="label-modern">Km véhicule</label>
                <input type="number" name="vehicleKm" value={formData.vehicleKm || ''} onChange={handleChange} className="input-modern" placeholder="130000" style={{ background: '#f0f9ff' }} />
              </div>
              <div className="form-field">
                <label className="label-modern">Conso (L/100)</label>
                <input type="number" step="0.1" name="fuelConsumption" value={formData.fuelConsumption} onChange={handleChange} className="input-modern" />
              </div>
              <div className="form-field">
                <label className="label-modern">Carburant (€)</label>
                <input type="number" step="0.01" name="fuelPrice" value={formData.fuelPrice} onChange={handleChange} className="input-modern" />
              </div>
              <div className="form-field">
                <label className="label-modern">Usure/km (€)</label>
                <input type="number" value={formData.wearCostPerKm} readOnly className="input-modern" style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
              </div>
            </div>
            
            <div className="info-modern-box animate-in" style={{ fontSize: '0.75rem', marginTop: '15px' }}>
              <strong>Calcul Dynamique :</strong> Base 0.15€/km + 0.15€/km par tranche de 5000 km.
              <br/>Taux actuel : <strong>{formData.wearCostPerKm}€/km</strong>.
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="summary-section" style={{ position: 'sticky', top: '20px' }}>
          <div className="card glass animate-in" style={{ border: '2px solid var(--accent)', padding: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Calculator size={28} color="var(--accent)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Récapitulatif</h3>
            </div>

            {!result ? (
              <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                <Truck size={48} style={{ margin: '0 auto 16px' }} />
                <p>En attente des données de distance...</p>
              </div>
            ) : (
              <div className="result-content">
                <div style={{ background: 'var(--accent)', color: 'white', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '24px', boxShadow: 'var(--shadow-accent)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8, marginBottom: '4px' }}>ESTIMATION TOTALE (HT)</div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 900 }}>{result.total.toFixed(2)}€</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.label}</span>
                      <span style={{ fontWeight: 700 }}>{item.amount.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <button className="btn-wow shadow-accent" style={{ width: '100%', marginTop: '32px' }}>
                  Éditer le devis PDF
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
