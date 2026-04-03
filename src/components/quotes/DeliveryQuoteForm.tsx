'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Fuel, Calculator, ChevronRight, ShieldCheck, Navigation, DollarSign } from 'lucide-react';
import { calculateDeliveryQuote, DeliveryQuoteInput, DeliveryQuoteResult } from '@/services/quoteCalculators';

interface DeliveryQuoteFormProps {
  clients: { id: string; name: string }[];
  defaultSettings: any;
}

export default function DeliveryQuoteForm({ clients, defaultSettings }: DeliveryQuoteFormProps) {
  const [localClients, setLocalClients] = useState<{id: string; name: string}[]>([]);
  const [result, setResult] = useState<DeliveryQuoteResult | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    origin: '',
    destination: '',
    distance: 0,
    duration: 0,
    fuelConsumption: 8.5,
    fuelPrice: defaultSettings?.fuelPriceDefault || 1.85,
    wearCostPerKm: 0.15,
    hourlyRate: defaultSettings?.travelHourlyRate || 35.0,
    tolls: 0,
    animalCount: 1,
    isHardship: false,
    hardshipSurcharge: 1.2,
    minForfait: 80,
    vehicleKm: 0,
  });

  // Charger clients depuis localStorage (fonctionne aussi sur Vercel)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('digitalsaurien_clients');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalClients(parsed.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch {}
  }, []);

  // Calcul en temps réel
  useEffect(() => {
    if (formData.distance > 0 || formData.duration > 0) {
      const calcInput: DeliveryQuoteInput = {
        ...formData,
        fuelPrice: Number(formData.fuelPrice),
        hourlyRate: Number(formData.hourlyRate)
      };
      setResult(calculateDeliveryQuote(calcInput));
    } else {
      setResult(null);
    }
  }, [formData]);

  const allClients = localClients.length > 0 ? localClients : clients;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    let parsedValue: any = type === 'number'
      ? (value === '' ? 0 : parseFloat(value) || 0)
      : type === 'checkbox' ? (e.target as HTMLInputElement).checked
      : value;

    if (name === 'vehicleKm') {
      // +0.15€/km par tranche de 5000 km
      const wear = parseFloat((0.15 + Math.floor(parsedValue / 5000) * 0.15).toFixed(2));
      setFormData(prev => ({ ...prev, vehicleKm: parsedValue, wearCostPerKm: wear }));
    } else {
      setFormData(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  return (
    <div className="container-center animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--spacing-xl)', alignItems: 'start', marginTop: 'var(--spacing-lg)' }}>

        {/* ── Colonne Gauche : Formulaire ── */}
        <div>
          {/* Bloc 1 : Logistique */}
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)', borderTop: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Navigation size={22} color="var(--accent)" /> Logistique Transport
              </h3>
              <span style={{ fontSize: '0.75rem', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                Sécurisé
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Client */}
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-modern">Client / Partenaire</label>
                <select name="clientId" className="input-modern" value={formData.clientId} onChange={handleChange}>
                  <option value="">— Sélectionner —</option>
                  {allClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {allClients.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    💡 <a href="/clients" style={{ color: 'var(--accent)' }}>Créez d'abord un client</a> pour le sélectionner ici.
                  </p>
                )}
              </div>

              {/* Titre */}
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-modern">Titre de la mission</label>
                <input type="text" name="title" className="input-modern" placeholder="Ex: Livraison Lyon → Paris" onChange={handleChange} />
              </div>

              {/* Départ */}
              <div>
                <label className="label-modern">Départ</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#10b981' }} />
                  <input type="text" name="origin" className="input-modern" placeholder="Ville de départ" onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Arrivée */}
              <div>
                <label className="label-modern">Arrivée</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#ef4444' }} />
                  <input type="text" name="destination" className="input-modern" placeholder="Ville d'arrivée" onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Distance */}
              <div>
                <label className="label-modern">Distance (km)</label>
                <input type="number" name="distance" value={formData.distance || ''} onChange={handleChange} className="input-modern" placeholder="0" min="0" />
              </div>

              {/* Durée */}
              <div>
                <label className="label-modern">Durée (h)</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input type="number" name="duration" value={formData.duration || ''} onChange={handleChange} className="input-modern" placeholder="0" step="0.5" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Péages */}
              <div>
                <label className="label-modern">Péages estimés (€)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input type="number" name="tolls" value={formData.tolls || ''} onChange={handleChange} className="input-modern" placeholder="0" style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              {/* Pénibilité */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: formData.isHardship ? 'var(--accent-soft)' : 'var(--background)', padding: '14px', borderRadius: 'var(--radius-md)', border: '2px solid', borderColor: formData.isHardship ? 'var(--accent)' : 'var(--border)', width: '100%', transition: 'all 0.2s' }}>
                  <input type="checkbox" name="isHardship" checked={formData.isHardship} onChange={handleChange} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nuit / WE / Férié</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Majoration {formData.hardshipSurcharge}x</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bloc 2 : Véhicule */}
          <div className="card">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
              <Fuel size={20} color="var(--accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Frais Véhicule</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div>
                <label className="label-modern">Km véhicule</label>
                <input type="number" name="vehicleKm" value={formData.vehicleKm || ''} onChange={handleChange} className="input-modern" placeholder="130000" style={{ background: '#f0f9ff' }} />
              </div>
              <div>
                <label className="label-modern">Conso (L/100)</label>
                <input type="number" step="0.1" name="fuelConsumption" value={formData.fuelConsumption} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="label-modern">Carburant (€/L)</label>
                <input type="number" step="0.01" name="fuelPrice" value={formData.fuelPrice} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="label-modern">Usure/km (€)</label>
                <input type="number" value={formData.wearCostPerKm} readOnly className="input-modern" style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: 700, color: 'var(--accent)' }} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', background: 'var(--background)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              📊 Base 0.15€/km + 0.15€ par tranche de 5 000 km · Taux actuel : <strong>{formData.wearCostPerKm}€/km</strong>
            </div>
          </div>
        </div>

        {/* ── Colonne Droite : Résultat ── */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="card glass" style={{ border: '2px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Calculator size={28} color="var(--accent)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Récapitulatif</h3>
            </div>

            {!result ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.5 }}>
                <Truck size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                <p style={{ fontSize: '0.9rem' }}>Saisissez la distance pour voir l'estimation instantanée</p>
              </div>
            ) : (
              <div className="animate-in">
                {/* Total Hero */}
                <div style={{ background: 'var(--accent)', color: 'white', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '24px', boxShadow: 'var(--shadow-accent)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimation Totale (HT)</div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>
                    {result.total.toFixed(2)}€
                  </div>
                </div>

                {/* Détail */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {result.breakdown.map((item: {label: string; amount: number}, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.label}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.amount.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <button className="btn-wow" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}>
                  Confirmer le transport
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div style={{ marginTop: '20px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--background)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>Taux horaire conducteur : <strong>{formData.hourlyRate}€/h</strong>. Estimation hors TVA.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
