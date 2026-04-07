'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Clock, 
  Cpu, 
  Database, 
  Cloud, 
  ShieldCheck, 
  Settings,
  Plus,
  Calculator,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  Loader2
} from 'lucide-react';
import { calculateAutomationQuote, AutomationQuoteInput, AutomationQuoteResult } from '@/services/quoteCalculators';
import { createAutomationQuote } from '@/app/actions/quotes';

interface AutomationQuoteFormProps {
  clients: { id: string; name: string }[];
  defaultSettings: any;
}

export default function AutomationQuoteForm({ clients, defaultSettings }: AutomationQuoteFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AutomationQuoteInput>({
    baseHours: 0,
    hourlyRate: defaultSettings.hourlyRate,
    complexityCoeff: 1.0,
    toolCount: 1,
    toolCoeff: 1.1,
    iaCount: 0,
    iaCoeff: 1.25,
    accountsCreated: 0,
    accountSetupFee: 50,
    subscriptionsSetup: 0,
    subscriptionFee: 30,
    hasMaintenance: false,
    maintenanceFee: 150,
    hasDatabase: false,
    dbFee: 200,
    discountPercent: 0,
  });

  const [result, setResult] = useState<AutomationQuoteResult | null>(null);

  useEffect(() => {
    if (formData.baseHours > 0) {
      const calcResult = calculateAutomationQuote(formData);
      setResult(calcResult);
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
        <div className="card shadow-glass" style={{ marginBottom: 'var(--spacing-lg)', borderTop: '4px solid #7c3aed' }}>
          <div className="card-header" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#7c3aed" className="icon-pulse" />
              Configuration de la Prestation
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(124, 58, 237, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
              Mode Premium
            </span>
          </div>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-xl)' }}>
            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label-modern">Client</label>
              <select name="clientId" className="input-modern" onChange={handleChange}>
                <option value="">Sélectionner un partenaire...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label-modern">Nom commercial du projet</label>
              <input type="text" name="title" className="input-modern" placeholder="Ex: Déploiement Automatisation CRM v2" onChange={handleChange} />
            </div>

            <div className="form-field">
              <label className="label-modern">Volume horaire initial (h)</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--text-muted)', opacity: 0.5 }} />
                <input type="number" name="baseHours" value={formData.baseHours === 0 ? '' : formData.baseHours} onChange={handleChange} className="input-modern" placeholder="0" min="0" />
              </div>
              <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Temps brut estimé hors complexité.</small>
            </div>

            <div className="form-field">
              <label className="label-modern">Complexité environnement</label>
              <select name="complexityCoeff" className="input-modern" onChange={handleChange} value={formData.complexityCoeff}>
                <option value="1.0">Standard (x1.0)</option>
                <option value="1.3">Intermédiaire (x1.3)</option>
                <option value="1.8">Écosystème Haut Risque (x1.8)</option>
              </select>
            </div>

            <div className="tool-multiplier-glass" style={{ gridColumn: 'span 2', padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8))', border: '1px solid var(--border)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-xl)' }}>
                <div className="form-field">
                  <label className="label-modern" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <Layers size={14} color="var(--primary)" /> Connecteurs SaaS (n)
                  </label>
                  <input type="number" name="toolCount" value={formData.toolCount || ''} onChange={handleChange} className="input-modern" style={{ background: 'white' }} min="1" />
                </div>
                <div className="form-field">
                  <label className="label-modern" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <Zap size={14} color="#f59e0b" /> Micro-services IA (n)
                  </label>
                  <input type="number" name="iaCount" value={formData.iaCount || ''} onChange={handleChange} className="input-modern" style={{ background: 'white' }} min="0" />
                </div>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 500 }}>
                💡 Chaque outil supplémentaire ajoute 10% d'effort d'intégration. Chaque IA ajoute 25%.
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-glass">
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--primary)" />
              Forfaits & Services Additifs
            </h3>
          </div>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-xl)' }}>
            <div className="checkbox-field" style={{ background: formData.hasDatabase ? 'rgba(124, 58, 237, 0.05)' : 'transparent', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', transition: 'all 0.2s' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasDatabase" checked={formData.hasDatabase} onChange={handleChange} className="checkbox-modern" />
                <div>
                   <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Forfait Base de Données</div>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mise en place & Mapping</div>
                </div>
              </label>
            </div>
            
            <div className="checkbox-field" style={{ background: formData.hasMaintenance ? 'rgba(124, 58, 237, 0.05)' : 'transparent', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', transition: 'all 0.2s' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="hasMaintenance" checked={formData.hasMaintenance} onChange={handleChange} className="checkbox-modern" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Maintenance Pro (Mois 1)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Garantie & Monitoring</div>
                </div>
              </label>
            </div>

            <div className="form-field">
              <label className="label-modern">Comptes utilisateurs à créer</label>
              <input type="number" name="accountsCreated" value={formData.accountsCreated || ''} onChange={handleChange} className="input-modern" min="0" />
            </div>

            <div className="form-field">
              <label className="label-modern">Remise commerciale (%)</label>
              <input type="number" name="discountPercent" value={formData.discountPercent || ''} onChange={handleChange} className="input-modern" placeholder="0" min="0" max="100" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary / Result Area */}
      <div className="summary-section" style={{ position: 'sticky', top: '20px' }}>
        <div className="card shadow-premium" style={{ border: '2px solid #7c3aed', background: 'linear-gradient(135deg, #ffffff, #fafaff)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Calculator size={24} color="#7c3aed" />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Synthèse Business</h3>
             </div>
             {result && (
               <button 
                onClick={() => window.print()} 
                className="btn btn-secondary no-print"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
               >
                 Générer PDF
               </button>
             )}
          </div>

          {!result || formData.baseHours <= 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div className="icon-empty-circle" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Clock size={30} opacity={0.2} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Veuillez renseigner le <br/><strong>volume horaire</strong> de base.</p>
            </div>
          ) : (
            <div className="breakdown-content animate-in">
              <div className="hero-stat" style={{ background: '#7c3aed', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '5px' }}>Temps de Réalisation Ajusté</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{result.adjustedHours.toFixed(1)}<span style={{ fontSize: '1rem', marginLeft: '4px' }}>h</span></div>
              </div>

              <div className="breakdown-table" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.breakdown.map((item, idx) => (
                  <div key={idx} className="breakdown-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.amount < 0 ? '#10b981' : 'var(--text-main)' }}>
                      {item.amount < 0 ? '-' : ''}{Math.abs(item.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="total-block" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Net à Payer (HT)</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>TVA non applicable</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#7c3aed', textAlign: 'right', letterSpacing: '-1px' }}>
                  {result.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </div>
              </div>

              <div className="actions" style={{ marginTop: '30px' }}>
                {saveError && (
                  <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '12px' }}>
                    {saveError}
                  </div>
                )}
                <button 
                  className="btn btn-primary btn-wow" 
                  onClick={async () => {
                    if (!formData.clientId) {
                      setSaveError("Veuillez sélectionner un client.");
                      return;
                    }
                    setIsSaving(true);
                    setSaveError(null);
                    const res = await createAutomationQuote({
                      clientId: formData.clientId!,
                      title: formData.title!,
                      total: result.total,
                      subtotal: result.subtotal,
                      breakdown: result.breakdown,
                      baseHours: formData.baseHours,
                      complexity: formData.complexityCoeff,
                      toolCount: formData.toolCount,
                      iaCount: formData.iaCount,
                      accountsCreated: formData.accountsCreated,
                      hasDatabase: formData.hasDatabase,
                      hasMaintenance: formData.hasMaintenance,
                    });
                    setIsSaving(false);
                    if (res.success) {
                      router.push('/dashboard');
                    } else {
                      setSaveError(res.error || "Une erreur est survenue.");
                    }
                  }}
                  disabled={isSaving}
                  style={{ width: '100%', padding: '16px', background: '#7c3aed', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Valider & Sauvegarder
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="info-modern-box" style={{ marginTop: '25px', padding: '15px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <ShieldCheck size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <p>Ce calcul respecte vos barèmes professionnels : <strong>{defaultSettings.hourlyRate}€/h</strong> en développement et <strong>{defaultSettings.travelHourlyRate}€/h</strong> en déplacement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
