'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Fuel, Calculator, ChevronRight, ShieldCheck, Navigation, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { calculateDeliveryQuote, DeliveryQuoteInput, DeliveryQuoteResult } from '@/services/quoteCalculators';

interface DeliveryQuoteFormProps {
  clients: { id: string; name: string }[];
  defaultSettings: any;
}

const SETTINGS_KEY = 'digitalsaurien_settings';

function loadSettings() {
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function DeliveryQuoteForm({ clients, defaultSettings }: DeliveryQuoteFormProps) {
  const [localClients, setLocalClients] = useState<{ id: string; name: string }[]>([]);
  const [result, setResult] = useState<DeliveryQuoteResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    origin: '',
    destination: '',
    // Trajet
    distance: 0,
    duration: 0,
    tolls: 0,
    // Véhicule
    vehicleKm: 0,
    fuelConsumption: 8.5,
    fuelPrice: 1.85,
    baseCostPerKm: 0.15,
    // Temps & Tarifs
    travelHourlyRate: 35,
    hourlyRate: 60,
    travelTimeCoeff: 0.5,
    // Pénibilité
    isHardship: false,
    hardshipRate: 10,
    // Divers
    animalCount: 1,
    minForfait: 80,
  });

  // Charger depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('digitalsaurien_clients');
      if (stored) setLocalClients(JSON.parse(stored).map((c: any) => ({ id: c.id, name: c.name })));
    } catch {}
    const settings = loadSettings();
    if (settings) {
      setFormData(prev => ({
        ...prev,
        hourlyRate: settings.hourlyRate ?? prev.hourlyRate,
        travelHourlyRate: settings.travelHourlyRate ?? prev.travelHourlyRate,
        fuelPrice: settings.fuelPriceDefault ?? prev.fuelPrice,
        baseCostPerKm: settings.baseCostPerKm ?? prev.baseCostPerKm,
        travelTimeCoeff: settings.travelTimeCoeff ?? prev.travelTimeCoeff,
        hardshipRate: settings.hardshipRate ?? prev.hardshipRate,
      }));
    }
  }, []);

  // Calcul en temps réel
  useEffect(() => {
    if (formData.distance > 0 || formData.duration > 0) {
      const input: DeliveryQuoteInput = {
        ...formData,
        fuelPrice: Number(formData.fuelPrice),
        travelHourlyRate: Number(formData.travelHourlyRate),
        hourlyRate: Number(formData.hourlyRate),
      };
      setResult(calculateDeliveryQuote(input));
    } else {
      setResult(null);
    }
  }, [formData]);

  const allClients = localClients.length > 0 ? localClients : clients;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const parsed = type === 'number' ? (parseFloat(value) || 0)
      : type === 'checkbox' ? (e.target as HTMLInputElement).checked
      : value;
    setFormData(prev => ({ ...prev, [name]: parsed }));
  };

  // Calcul du tarif véhicule pour affichage
  const kmSurcharge = formData.vehicleKm <= 50000 ? 0
    : formData.vehicleKm <= 100000 ? 0.01
    : formData.vehicleKm <= 150000 ? 0.02
    : formData.vehicleKm <= 200000 ? 0.03 : 0.04;
  const vehicleRatePerKm = formData.baseCostPerKm + kmSurcharge;

  return (
    <div className="container-center animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--spacing-xl)', alignItems: 'start', marginTop: 'var(--spacing-lg)' }}>

        {/* ── Gauche : Formulaire ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

          {/* Bloc 1 : Trajet */}
          <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Navigation size={22} color="var(--accent)" /> Détails du Trajet
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-modern">Client / Partenaire</label>
                <select name="clientId" className="input-modern" value={formData.clientId} onChange={handleChange}>
                  <option value="">— Sélectionner —</option>
                  {allClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {allClients.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    💡 <a href="/clients" style={{ color: 'var(--accent)' }}>Créez d'abord un client</a>
                  </p>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="label-modern">Titre de la mission</label>
                <input name="title" type="text" className="input-modern" placeholder="Ex: Transport reptiles Lyon → Paris" onChange={handleChange} />
              </div>

              <div>
                <label className="label-modern">Départ</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#10b981' }} />
                  <input name="origin" type="text" className="input-modern" placeholder="Ville" onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              <div>
                <label className="label-modern">Arrivée</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#ef4444' }} />
                  <input name="destination" type="text" className="input-modern" placeholder="Ville" onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              <div>
                <label className="label-modern">Distance (km)</label>
                <input name="distance" type="number" className="input-modern" placeholder="0" min="0" value={formData.distance || ''} onChange={handleChange} />
              </div>

              <div>
                <label className="label-modern">Durée de trajet (h)</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input name="duration" type="number" className="input-modern" placeholder="0" step="0.5" value={formData.duration || ''} onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              <div>
                <label className="label-modern">Péages estimés (€)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input name="tolls" type="number" className="input-modern" placeholder="0" value={formData.tolls || ''} onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                  padding: '14px', borderRadius: 'var(--radius-md)', width: '100%',
                  border: `2px solid ${formData.isHardship ? 'var(--accent)' : 'var(--border)'}`,
                  background: formData.isHardship ? 'var(--accent-soft)' : 'var(--background)',
                  transition: 'all 0.2s'
                }}>
                  <input type="checkbox" name="isHardship" checked={formData.isHardship} onChange={handleChange} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nuit / Week-end / Férié</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+{formData.hardshipRate}% sur le temps de trajet</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bloc 2 : Véhicule */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Fuel size={20} color="var(--accent)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Frais Véhicule</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="label-modern">Km véhicule</label>
                <input name="vehicleKm" type="number" className="input-modern" placeholder="Ex: 80000" value={formData.vehicleKm || ''} onChange={handleChange} style={{ background: '#f0f9ff' }} />
              </div>
              <div>
                <label className="label-modern">Conso (L/100)</label>
                <input name="fuelConsumption" type="number" step="0.1" className="input-modern" value={formData.fuelConsumption} onChange={handleChange} />
              </div>
              <div>
                <label className="label-modern">Carburant (€/L)</label>
                <input name="fuelPrice" type="number" step="0.01" className="input-modern" value={formData.fuelPrice} onChange={handleChange} />
              </div>
              <div>
                <label className="label-modern" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Tarif/km
                  <Info size={12} color="var(--text-muted)" title="Calculé automatiquement selon le kilométrage" />
                </label>
                <div style={{
                  padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                  background: vehicleRatePerKm > 0.30 ? '#fef9c3' : '#f1f5f9',
                  border: `2px solid ${vehicleRatePerKm > 0.30 ? '#fbbf24' : 'var(--border)'}`,
                  fontWeight: 800, color: vehicleRatePerKm > 0.30 ? '#854d0e' : 'var(--accent)',
                  fontSize: '0.95rem'
                }}>
                  {vehicleRatePerKm.toFixed(2)} €/km
                </div>
              </div>
            </div>

            {/* Alerte tarif véhicule */}
            {vehicleRatePerKm > 0.30 && (
              <div style={{ display: 'flex', gap: '8px', background: '#fef9c3', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#854d0e' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>Le tarif véhicule dépasse 0,30€/km. Vérifiez le kilométrage saisi.</span>
              </div>
            )}

            {/* Tableau des paliers */}
            <div style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {[
                { label: '0-50k km', val: '+0,00€' },
                { label: '50-100k km', val: '+0,01€' },
                { label: '100-150k km', val: '+0,02€' },
                { label: '150-200k km', val: '+0,03€' },
                { label: '200k+ km', val: '+0,04€' },
              ].map(p => (
                <div key={p.label} style={{
                  textAlign: 'center', padding: '6px',
                  borderRadius: '6px',
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{p.label}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{p.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloc 3 : Paramètres avancés */}
          <div className="card">
            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)', padding: 0 }}
            >
              <ChevronRight size={16} style={{ transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
              Paramètres de tarification avancés
            </button>

            {showAdvanced && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
                <div>
                  <label className="label-modern">Taux déplacement (€/h)</label>
                  <input name="travelHourlyRate" type="number" step="1" className="input-modern" value={formData.travelHourlyRate} onChange={handleChange} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Taux horaire conducteur/déplacement</p>
                </div>
                <div>
                  <label className="label-modern">Coeff. temps trajet</label>
                  <input name="travelTimeCoeff" type="number" step="0.05" min="0" max="1" className="input-modern" value={formData.travelTimeCoeff} onChange={handleChange} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>0,5 = 50% du taux (recommandé)</p>
                </div>
                <div>
                  <label className="label-modern">Taux majoration nuit/WE (%)</label>
                  <input name="hardshipRate" type="number" step="5" min="0" max="100" className="input-modern" value={formData.hardshipRate} onChange={handleChange} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Appliqué sur le temps de trajet seul</p>
                </div>
                <div>
                  <label className="label-modern">Base véhicule (€/km)</label>
                  <input name="baseCostPerKm" type="number" step="0.01" min="0" className="input-modern" value={formData.baseCostPerKm} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-modern">Forfait minimum (€)</label>
                  <input name="minForfait" type="number" step="5" min="0" className="input-modern" value={formData.minForfait} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-modern">Nb animaux</label>
                  <input name="animalCount" type="number" step="1" min="1" className="input-modern" value={formData.animalCount} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Droite : Résultat ── */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="card glass" style={{ border: '2px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Calculator size={28} color="var(--accent)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Récapitulatif</h3>
            </div>

            {!result ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.45 }}>
                <Truck size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                <p style={{ fontSize: '0.9rem' }}>Saisissez la distance pour voir l'estimation</p>
              </div>
            ) : (
              <div className="animate-in">
                {/* Total Hero */}
                <div style={{
                  background: 'var(--accent)', color: 'white',
                  padding: '24px', borderRadius: 'var(--radius-md)',
                  textAlign: 'center', marginBottom: '24px',
                  boxShadow: 'var(--shadow-accent)'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Total HT
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>
                    {result.total.toFixed(2)}€
                  </div>
                  {result.vehicleKmAlert && (
                    <div style={{ fontSize: '0.75rem', background: 'rgba(251,191,36,0.2)', marginTop: '8px', padding: '4px 10px', borderRadius: '20px' }}>
                      ⚠️ Tarif véhicule élevé — vérifiez les paramètres
                    </div>
                  )}
                </div>

                {/* Détail par poste */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      padding: '10px 0', borderBottom: '1px solid var(--border)'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', flex: 1, paddingRight: '12px' }}>
                        {item.label}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', flexShrink: 0, color: item.amount < 0 ? 'var(--success)' : 'var(--text-main)' }}>
                        {item.amount >= 0 ? '' : '−'}{Math.abs(item.amount).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>

                {/* Info tarif véhicule */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--background)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                  Participation véhicule : <strong>{result.vehicleRatePerKm.toFixed(3)}€/km</strong>
                  {formData.vehicleKm > 0 && ` (véhicule à ${formData.vehicleKm.toLocaleString('fr-FR')} km)`}
                </div>

                <button className="btn-wow" style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '1rem'
                }}>
                  Confirmer & Sauvegarder
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--background)', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <ShieldCheck size={14} color="#10b981" style={{ flexShrink: 0 }} />
              <span>Taux conducteur : {formData.travelHourlyRate}€/h × {formData.travelTimeCoeff * 100}%. Estimation HT.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
