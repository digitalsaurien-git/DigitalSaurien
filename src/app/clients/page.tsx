'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Mail, Phone, MapPin, Trash2, Save, RefreshCw, X } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

const STORAGE_KEY = 'digitalsaurien_clients';

function genId() {
  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setClients(JSON.parse(stored));
    } catch {}
  }, []);

  const saveClients = (list: Client[]) => {
    setClients(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const addClient = () => {
    if (!form.name.trim()) return;
    const newClient: Client = {
      id: genId(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };
    saveClients([newClient, ...clients]);
    setForm({ name: '', email: '', phone: '', address: '' });
    setShowForm(false);
  };

  const deleteClient = (id: string) => {
    if (!confirm('Supprimer ce client ?')) return;
    saveClients(clients.filter(c => c.id !== id));
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="container-center animate-in" style={{ paddingTop: 'var(--spacing-lg)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
            Clients & Partenaires
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {clients.length} contact{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''} · Stockage local
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {saved && (
            <span style={{ 
              background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
              padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
            }}>
              ✅ Sauvegardé
            </span>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn-wow"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem' }}
          >
            <Plus size={20} />
            Nouveau Client
          </button>
        </div>
      </div>

      {/* Modal Ajout */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card animate-in" style={{ width: '500px', maxWidth: '95vw', position: 'relative' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} color="var(--text-muted)" />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>
              Nouveau contact
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label-modern">Nom / Entreprise *</label>
                <input
                  className="input-modern"
                  placeholder="Ex: Écuries du Soleil"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  autoFocus
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="label-modern">Email</label>
                  <input
                    className="input-modern"
                    type="email"
                    placeholder="contact@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-modern">Téléphone</label>
                  <input
                    className="input-modern"
                    type="tel"
                    placeholder="06 XX XX XX XX"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label-modern">Adresse</label>
                <input
                  className="input-modern"
                  placeholder="Ville ou adresse complète"
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                Annuler
              </button>
              <button
                onClick={addClient}
                disabled={!form.name.trim()}
                className="btn-wow"
                style={{ padding: '12px 28px', borderRadius: 'var(--radius-md)', opacity: form.name.trim() ? 1 : 0.5 }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="card glass" style={{ marginBottom: 'var(--spacing-lg)', padding: '16px 24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="input-modern"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      {/* Clients List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👤</div>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>
            {search ? 'Aucun résultat' : 'Aucun client pour le moment'}
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            {search ? 'Modifiez votre recherche.' : 'Cliquez sur "Nouveau Client" pour en ajouter un.'}
          </p>
          {!search && (
            <button onClick={() => setShowForm(true)} className="btn-wow" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)' }}>
              <Plus size={16} /> Ajouter un client
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((client, idx) => (
            <div
              key={client.id}
              className="card animate-in"
              style={{ 
                display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px',
                animationDelay: `${idx * 0.05}s`
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                background: `hsl(${client.name.charCodeAt(0) * 5}, 60%, 92%)`,
                color: `hsl(${client.name.charCodeAt(0) * 5}, 60%, 35%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.2rem', flexShrink: 0
              }}>
                {client.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{client.name}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {client.email && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {client.email}
                    </span>
                  )}
                  {client.phone && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {client.phone}
                    </span>
                  )}
                  {client.address && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {client.address}
                    </span>
                  )}
                </div>
              </div>

              {/* Date */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0 }}>
                {client.createdAt}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteClient(client.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
