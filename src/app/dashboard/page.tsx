import React from 'react';
export const dynamic = 'force-dynamic';
import { 
  PlusCircle, 
  Truck, 
  Zap, 
  GitBranch, 
  TrendingUp, 
  Users, 
  FileText,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Stats Summary Area */}
      <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Chiffre d'affaires mensuel</span>
            <TrendingUp size={16} color="var(--success)" />
          </div>
          <div className="stat-value">12,450.00 €</div>
          <div className="stat-trend success">+12% vs mois dernier</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Devis en attente</span>
            <FileText size={16} color="var(--warning)" />
          </div>
          <div className="stat-value">8</div>
          <div className="stat-trend">4 livraisons, 4 IT</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Clients actifs</span>
            <Users size={16} color="var(--accent)" />
          </div>
          <div className="stat-value">42</div>
          <div className="stat-trend">+2 cette semaine</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span className="stat-label">Schémas générés</span>
            <GitBranch size={16} color="var(--secondary)" />
          </div>
          <div className="stat-value">156</div>
          <div className="stat-trend">Depuis le début</div>
        </div>
      </div>

      {/* Quick Actions Area */}
      <div className="section-header" style={{ marginBottom: 'var(--spacing-md)' }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Actions rapides</h2>
      </div>
      <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div className="card action-card interactive" style={{ cursor: 'pointer', border: '1px dashed var(--accent)', background: 'rgba(59, 130, 246, 0.02)' }}>
          <div className="action-icon" style={{ background: 'var(--accent)', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Truck size={20} />
          </div>
          <h3 style={{ fontSize: '0.925rem', marginBottom: '4px' }}>Nouveau devis Livraison</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chiffrer un trajet d'animaux</p>
        </div>
        
        <div className="card action-card interactive" style={{ cursor: 'pointer', border: '1px dashed var(--accent)', background: 'rgba(59, 130, 246, 0.02)' }}>
          <div className="action-icon" style={{ background: '#7c3aed', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Zap size={20} />
          </div>
          <h3 style={{ fontSize: '0.925rem', marginBottom: '4px' }}>Nouveau devis Automation</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projet digital ou IA</p>
        </div>

        <div className="card action-card interactive" style={{ cursor: 'pointer', border: '1px dashed var(--accent)', background: 'rgba(59, 130, 246, 0.02)' }}>
          <div className="action-icon" style={{ background: '#0f172a', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <GitBranch size={20} />
          </div>
          <h3 style={{ fontSize: '0.925rem', marginBottom: '4px' }}>Nouveau schéma</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Convertir texte en diagramme</p>
        </div>
      </div>

      {/* Recent Activity / Mixed Lists Area */}
      <div className="activity-mixed-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
        {/* Recent Quotes Table */}
        <div className="card recent-quotes-section">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: '0.95rem' }}>Derniers devis générés</h3>
            <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>Voir tout</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>CLIENT</th>
                  <th>TYPE</th>
                  <th>DATE</th>
                  <th>MONTANT</th>
                  <th>STATUT</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>Jean Dupont</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Elevage canin Lyon</div>
                  </td>
                  <td><span className="badge badge-info">Livraison</span></td>
                  <td>12 Mars 2024</td>
                  <td style={{ fontWeight: 600 }}>450.00 €</td>
                  <td><span className="badge badge-success">Payé</span></td>
                  <td><ChevronRight size={16} /></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>TechCorp Solutions</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Automatisation CRM</div>
                  </td>
                  <td><span className="badge badge-warning">IT / IA</span></td>
                  <td>11 Mars 2024</td>
                  <td style={{ fontWeight: 600 }}>2,800.00 €</td>
                  <td><span className="badge badge-warning">Envoi</span></td>
                  <td><ChevronRight size={16} /></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>Sophie Martin</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Association Reptiles 69</div>
                  </td>
                  <td><span className="badge badge-info">Livraison</span></td>
                  <td>10 Mars 2024</td>
                  <td style={{ fontWeight: 600 }}>185.00 €</td>
                  <td><span className="badge badge-error">Echu</span></td>
                  <td><ChevronRight size={16} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Diagrams Panel */}
        <div className="card recent-diagrams-section">
          <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--spacing-lg)' }}>Schémas récents</h3>
          <div className="diagram-mini-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="diagram-item" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Processus Livraison Express</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Il y a 2 heures</div>
            </div>
            <div className="diagram-item" style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Architecture IA Automatisation</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hier, 14:30</div>
            </div>
            <div className="diagram-item" style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Worklow Approvisionnement</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>9 Mars 2024</div>
            </div>
          </div>
          <button className="btn btn-secondary w-full" style={{ marginTop: '20px', width: '100%', fontSize: '0.8rem' }}>Accéder à l'historique</button>
        </div>
      </div>

    </div>
  );
}
