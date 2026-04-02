'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { calculateAutomationQuote, AutomationQuoteInput, AutomationQuoteResult } from '@/services/quoteCalculators';

interface AutomationQuoteFormProps {
  clients: { id: string; name: string }[];
  defaultSettings: any;
}

export default function AutomationQuoteForm({ clients, defaultSettings }: AutomationQuoteFormProps) {
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
              <Zap size={18} color="#7c3aed" />
              Détails du Projet Automation
            </h3>
          </div>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label">Client</label>
              <select name="clientId" className="input" onChange={handleChange}>
                <option value="">Sélectionner un client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
              <label className="label">Nom de la prestation</label>
              <input type="text" name="title" className="input" placeholder="Ex: Automatisation Pipeline Lead Gen" onChange={handleChange} />
            </div>

            <div className="form-field">
              <label className="label">Temps de base estimé (heures)</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input type="number" name="baseHours" value={formData.baseHours} onChange={handleChange} className="input" placeholder="0" />
              </div>
            </div>

            <div className="form-field">
              <label className="label">Complexité métier</label>
              <select name="complexityCoeff" className="input" onChange={handleChange} value={formData.complexityCoeff}>
                <option value="1.0">Basse (x1.0)</option>
                <option value="1.3">Moyenne (x1.3)</option>
                <option value="1.8">Haute (x1.8)</option>
              </select>
            </div>

            <div className="card" style={{ gridColumn: 'span 2', padding: '15px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                <div className="form-field">
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} /> Nombre d'outils (SaaS)
                  </label>
                  <input type="number" name="toolCount" value={formData.toolCount} onChange={handleChange} className="input" />
                </div>
                <div className="form-field">
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="#7c3aed" /> Nombre d'IA isolées
                  </label>
                  <input type="number" name="iaCount" value={formData.iaCount} onChange={handleChange} className="input" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--primary)" />
              Options & Services Complémentaires
            </h3>
          </div>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
            <div className="form-field">
              <label className="label">Installation BDD</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="hasDatabase" checked={formData.hasDatabase} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '0.85rem' }}>Forfait Database</span>
              </div>
            </div>
            
            <div className="form-field">
              <label className="label">Maintenance proactive</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="hasMaintenance" checked={formData.hasMaintenance} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '0.85rem' }}>Maintenance (Mois 1)</span>
              </div>
            </div>

            <div className="form-field">
              <label className="label">Comptes à créer</label>
              <input type="number" name="accountsCreated" value={formData.accountsCreated} onChange={handleChange} className="input" />
            </div>

            <div className="form-field">
              <label className="label">Remise (%)</label>
              <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className="input" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary / Result Area */}
      <div className="summary-section">
        <div className="card" style={{ position: 'sticky', top: '20px', border: '1px solid #7c3aed', background: 'rgba(124, 58, 237, 0.02)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px', fontWeight: 700 }}>Chiffrage Automation</h3>

          {!result ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Calculator size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.8rem' }}>Saisissez le temps de base pour générer le devis.</p>
            </div>
          ) : (
            <div className="breakdown-list">
              <div className="stats-mini" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <div className="mini-card" style={{ flex: 1, background: 'var(--surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Temps Ajusté</div>
                  <div style={{ fontWeight: 700 }}>{result.adjustedHours.toFixed(1)}h</div>
                </div>
              </div>

              {result.breakdown.map((item, idx) => (
                <div key={idx} className="breakdown-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500 }}>{item.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                </div>
              ))}
              
              <div className="total-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>MONTANT PROJET</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#7c3aed' }}>
                  {result.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>

              <div className="actions" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '12px', background: '#7c3aed' }}>
                  Valider le devis
                </button>
              </div>
            </div>
          )}

          <div className="info-box" style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
            <Info size={14} style={{ marginTop: '2px' }} />
            <p>La complexité de l'automatisation dépend du nombre d'outils et d'IA intégrés au workflow.</p>
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
