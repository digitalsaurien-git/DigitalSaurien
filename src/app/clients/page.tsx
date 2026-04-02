import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { Plus, Search, User, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';

async function getClients() {
  return await prisma.client.findMany({
    orderBy: { name: 'asc' }
  });
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="clients-page">
      <div className="page-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Rechercher un client..." 
            className="input" 
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <Link href="/clients/new" className="btn btn-primary">
          <Plus size={18} />
          Nouveau Client
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 24px' }}>NOM / ENTREPRISE</th>
              <th>CONTACT</th>
              <th>ADRESSE</th>
              <th>DEVIS</th>
              <th style={{ width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun client trouvé. Commencez par en ajouter un.
                </td>
              </tr>
            ) : (
              clients.map((client: any) => (
                <tr key={client.id} className="table-row-hover">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar" style={{ background: 'var(--background)', color: 'var(--primary)', fontWeight: 600, width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {client.name.charAt(0)}
                      </div>
                      <div style={{ fontWeight: 600 }}>{client.name}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={12} color="var(--text-muted)" />
                        {client.email || '—'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={12} color="var(--text-muted)" />
                        {client.phone || '—'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <MapPin size={12} />
                      {client.address || '—'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>0 devis</span>
                  </td>
                  <td>
                    <Link href={`/clients/${client.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
