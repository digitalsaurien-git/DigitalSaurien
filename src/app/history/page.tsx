'use client';

import React, { useState, useEffect } from 'react';
import {
  History, Search, Filter, Truck, Zap, GitBranch,
  ChevronRight, MoreVertical, Trash2
} from 'lucide-react';

const QUOTES_KEY = 'digitalsaurien_quotes';
const DIAGRAMS_KEY = 'digitalsaurien_diagrams';
const CLIENTS_KEY = 'digitalsaurien_clients';

export default function HistoryPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'quotes' | 'diagrams'>('all');

  useEffect(() => {
    try {
      const q = localStorage.getItem(QUOTES_KEY);
      const d = localStorage.getItem(DIAGRAMS_KEY);
      const c = localStorage.getItem(CLIENTS_KEY);
      const clientMap: Record<string, string> = {};
      if (c) {
        JSON.parse(c).forEach((cl: any) => { clientMap[cl.id] = cl.name; });
      }
      const parsedQ = q ? JSON.parse(q).map((item: any) => ({
        ...item,
        clientName: clientMap[item.clientId] || item.clientId || '—',
      })) : [];
      setQuotes(parsedQ);
      setDiagrams(d ? JSON.parse(d) : []);
    } catch {}
  }, []);

  const deleteQuote = (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return;
    const updated = quotes.filter(q => q.id !== id);
    setQuotes(updated);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
  };

  const deleteDiagram = (id: string) => {
    if (!confirm('Supprimer ce schéma ?')) return;
    const updated = diagrams.filter(d => d.id !== id);
    setDiagrams(updated);
    localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(updated));
  };

  const filteredQuotes = quotes.filter(q =>
    (q.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.clientName || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredDiagrams = diagrams.filter(d =>
    (d.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const showQuotes = tab === 'all' || tab === 'quotes';
  const showDiagrams = tab === 'all' || tab === 'diagrams';
  const totalItems = (showQuotes ? filteredQuotes.length : 0) + (showDiagrams ? filteredDiagrams.length : 0);

  return (
    <div className="container-center animate-in" style={{ paddingTop: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
            Historique Complet
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {quotes.length} devis · {diagrams.length} schémas · Stockage local
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="card glass" style={{ marginBottom: '16px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Rechercher par titre, client..."
              className="input-modern"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {([
          { key: 'all', label: `Tout (${quotes.length + diagrams.length})` },
          { key: 'quotes', label: `Devis (${quotes.length})` },
          { key: 'diagrams', label: `Schémas (${diagrams.length})` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 20px', borderRadius: '30px', border: '2px solid',
              fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              borderColor: tab === t.key ? 'var(--accent)' : 'var(--border)',
              background: tab === t.key ? 'var(--accent)' : 'white',
              color: tab === t.key ? 'white' : 'var(--text-main)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {totalItems === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>
            {search ? 'Aucun résultat' : 'Aucun historique'}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {search ? 'Modifiez votre recherche.' : 'Créez vos premiers devis depuis le tableau de bord.'}
          </p>
        </div>
      )}

      {/* Quotes */}
      {showQuotes && filteredQuotes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Devis ({filteredQuotes.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                className="card animate-in"
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', animationDelay: `${idx * 0.04}s` }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: quote.type === 'AUTOMATION' ? '#f5f3ff' : '#eff6ff', flexShrink: 0 }}>
                  {quote.type === 'AUTOMATION' ? <Zap size={18} color="#7c3aed" /> : <Truck size={18} color="#3b82f6" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{quote.title || 'Devis sans titre'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Client : {quote.clientName} · {quote.createdAt}
                  </div>
                </div>
                {quote.total && (
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>
                    {Number(quote.total).toFixed(2)}€
                  </div>
                )}
                <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                  {quote.status || 'BROUILLON'}
                </span>
                <button
                  onClick={() => deleteQuote(quote.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagrams */}
      {showDiagrams && filteredDiagrams.length > 0 && (
        <div>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Schémas ({filteredDiagrams.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredDiagrams.map((diagram, idx) => (
              <div
                key={diagram.id}
                className="card animate-in"
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', animationDelay: `${idx * 0.04}s` }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexShrink: 0 }}>
                  <GitBranch size={18} color="var(--secondary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{diagram.title || 'Schéma sans titre'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Généré le {diagram.createdAt}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                  COMPLÉTÉ
                </span>
                <button
                  onClick={() => deleteDiagram(diagram.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
