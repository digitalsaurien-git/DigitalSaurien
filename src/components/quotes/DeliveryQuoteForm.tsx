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
  });

  const [result, setResult] = useState<DeliveryQuoteResult | null>(null);

  useEffect(() => {
    if (formData.distance > 0 || formData.duration > 0) {
      const calcResult = calculateDeliveryQuote(formData);
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
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  return (
    <div className="quote-form-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--spacing-xl)', alignItems: 'start' }}>
      {/* Inputs Area */}
      <div className="inputs-section">
        <div className="card shadow-glass" style={{ marginBottom: 'var(--spacing-lg)', borderTop: '4px solid var(--accent)' }}>
          <div className="card-header" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={20} color="var(--accent)" className="icon-pulse" />
              Détails Logistiques du Transport
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '20px', color: 'var(--accent)' }}>
              Mode Sécurisé
            </span>
          </div>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-xl)' }}>
            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label-modern">Partenaire / Client</label>
              <select name="clientId" className="input-modern" value={formData.clientId} onChange={handleChange}>
                <option value="">Sélectionner un expéditeur...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label-modern">Libellé de la mission</label>
              <input type="text" name="title" className="input-modern" placeholder="Ex: Livraison Urgent Reptiles Lyon -> Paris" onChange={handleChange} />
            </div>

            <div className="form-field">
              <label className="label-modern">Lieu de prise en charge</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: '#10b981', opacity: 0.6 }} />
                <input type="text" name="origin" className="input-modern" placeholder="Ville ou CP" onChange={handleChange} />
              </div>
            </div>
            
            <div className="form-field">
              <label className="label-modern">Lieu de livraison</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: '#ef4444', opacity: 0.6 }} />
                <input type="text" name="destination" className="input-modern" placeholder="Ville ou CP" onChange={handleChange} />
              </div>
            </div>

            <div className="form-field">
              <label className="label-modern">Distance réelle (km)</label>
              <input type="number" name="distance" value={formData.distance === 0 ? '' : formData.distance} onChange={handleChange} className="input-modern" placeholder="0" min="0" />
            </div>

            <div className="form-field">
              <label className="label-modern">Temps de trajet (h)</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--text-muted)', opacity: 0.5 }} />
                <input type="number" name="duration" value={formData.duration === 0 ? '' : formData.duration} onChange={handleChange} className="input-modern" placeholder="0" min="0" step="0.5" />
              </div>
            </div>

            <div className="form-field">
              <label className="label-modern">Estimatif Péages (€)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--text-muted)', opacity: 0.5 }} />
                <input type="number" name="tolls" value={formData.tolls === 0 ? '' : formData.tolls} onChange={handleChange} className="input-modern" placeholder="0" min="0" />
              </div>
            </div>

            <div className="checkbox-field" style={{ background: formData.isHardship ? 'rgba(59, 130, 246, 0.05)' : 'transparent', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', transition: 'all 0.2s', alignSelf: 'end', marginBottom: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="isHardship" checked={formData.isHardship} onChange={handleChange} className="checkbox-modern" />
                <div>
                   <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Pénibilité (Nuit/WE/Férié)</div>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Applique une majoration de {formData.hardshipSurcharge}x</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="card shadow-glass">
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Fuel size={18} color="var(--primary)" />
              Paramètres Véhicule & Carburant
            </h3>
          </div>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-xl)' }}>
            <div className="form-field">
              <label className="label-modern">Conso (L/100km)</label>
              <input type="number" step="0.1" name="fuelConsumption" value={formData.fuelConsumption} onChange={handleChange} className="input-modern" style={{ background: '#f8fafc' }} />
            </div>
            <div className="form-field">
              <label className="label-modern">Prix carburant (€)</label>
              <input type="number" step="0.01" name="fuelPrice" value={formData.fuelPrice} onChange={handleChange} className="input-modern" style={{ background: '#f8fafc' }} />
            </div>
            <div className="form-field">
              <label className="label-modern">Usure/km (€)</label>
              <input type="number" step="0.01" name="wearCostPerKm" value={formData.wearCostPerKm} onChange={handleChange} className="input-modern" style={{ background: '#f8fafc' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary / Result Area */}
      <div className="summary-section" style={{ position: 'sticky', top: '20px' }}>
        <div className="card shadow-premium" style={{ border: '2px solid var(--accent)', background: 'linear-gradient(135deg, #ffffff, #f0f7ff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
             <Calculator size={24} color="var(--accent)" />
             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Synthèse Transport</h3>
          </div>

          {!result ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div className="icon-empty-circle" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Truck size={30} opacity={0.2} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Veuillez renseigner la <br/><strong>distance</strong> du trajet.</p>
            </div>
          ) : (
            <div className="breakdown-content animate-in">
              <div className="hero-stat" style={{ background: 'var(--accent)', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '5px' }}>Estimation Bas-Coût</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{result.total.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}<span style={{ fontSize: '1rem', marginLeft: '4px' }}>€</span></div>
              </div>

              <div className="breakdown-table" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.breakdown.map((item, idx) => (
                  <div key={idx} className="breakdown-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="total-block" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Montant Final (HT)</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Calcul dynamique</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)', textAlign: 'right', letterSpacing: '-1px' }}>
                  {result.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </div>
              </div>

              <div className="actions" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-primary btn-wow shadow-accent" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  Valider le transport
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="info-modern-box" style={{ marginTop: '25px', padding: '15px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <ShieldCheck size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <p>Transport sous bourses de fret privées. Taux horaire conducteur appliqué : <strong>{formData.hourlyRate}€/h</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
