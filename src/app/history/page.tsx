import React from 'react';
import { prisma } from '@/lib/db';
import { 
  History, 
  Search, 
  Filter, 
  Truck, 
  Zap, 
  GitBranch, 
  FileText,
  ChevronRight,
  MoreVertical,
  Download,
  Copy
} from 'lucide-react';
import Link from 'next/link';

async function getHistory() {
  const [quotes, diagrams] = await Promise.all([
    prisma.quote.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.diagram.findMany({
      orderBy: { createdAt: 'desc' }
    })
  ]);
  
  return { quotes, diagrams };
}

export default async function HistoryPage() {
  const { quotes, diagrams } = await getHistory();

  return (
    <div className="history-page">
      <div className="page-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="page-title">Historique Complet</h1>
        <div className="actions" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <div className="search-bar" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Rechercher..." className="input input-sm" style={{ paddingLeft: '34px', fontSize: '0.85rem' }} />
          </div>
          <button className="btn btn-secondary btn-sm">
            <Filter size={16} />
            Filtres
          </button>
        </div>
      </div>

      <div className="history-tabs" style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <button className="tab-btn active">Tout ({quotes.length + diagrams.length})</button>
        <button className="tab-btn">Devis ({quotes.length})</button>
        <button className="tab-btn">Schémas ({diagrams.length})</button>
      </div>

      <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {quotes.map((quote: any) => (
          <div key={quote.id} className="card history-item" style={{ padding: '15px 20px', display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 120px 40px', alignItems: 'center', gap: '20px' }}>
            <div className={`type-icon ${quote.type === 'DELIVERY' ? 'delivery' : 'automation'}`} style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: quote.type === 'DELIVERY' ? '#eff6ff' : '#f5f3ff' }}>
              {quote.type === 'DELIVERY' ? <Truck size={18} color="#3b82f6" /> : <Zap size={18} color="#7c3aed" />}
            </div>
            
            <div className="item-info">
              <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{quote.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Client: {quote.client.name}</div>
            </div>

            <div className="item-date" style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
            </div>

            <div className="item-amount" style={{ fontWeight: 700, textAlign: 'right' }}>
              {quote.totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>

            <div className="item-status">
              <span className={`badge badge-${quote.status === 'PAID' ? 'success' : 'warning'}`} style={{ fontSize: '0.7rem' }}>
                {quote.status}
              </span>
            </div>

            <div className="item-actions">
               <button className="btn-icon"><MoreVertical size={18} color="var(--text-muted)" /></button>
            </div>
          </div>
        ))}

        {diagrams.map((diagram: any) => (
          <div key={diagram.id} className="card history-item" style={{ padding: '15px 20px', display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 120px 40px', alignItems: 'center', gap: '20px' }}>
            <div className="type-icon diagram" style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
              <GitBranch size={18} color="var(--secondary)" />
            </div>
            
            <div className="item-info">
              <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{diagram.title || "Schéma de process"}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Génération via texte</div>
            </div>

            <div className="item-date" style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {new Date(diagram.createdAt).toLocaleDateString('fr-FR')}
            </div>

            <div className="item-amount" style={{ fontWeight: 700, textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              —
            </div>

            <div className="item-status">
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>COMPLÉTÉ</span>
            </div>

            <div className="item-actions">
               <button className="btn-icon"><MoreVertical size={18} color="var(--text-muted)" /></button>
            </div>
          </div>
        ))}

        {quotes.length === 0 && diagrams.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <History size={48} style={{ margin: '0 auto 15px', opacity: 0.2 }} />
            <p>Aucun historique disponible pour le moment.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-btn {
          background: none;
          border: none;
          padding: 8px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
        }
        .tab-btn.active {
          color: var(--accent);
          font-weight: 600;
        }
        .history-item:hover {
          background: #fcfcfc;
          border-color: var(--accent);
          transition: border-color 0.2s ease;
        }
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
