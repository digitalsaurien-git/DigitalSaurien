import React from 'react';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ChevronLeft, Save, User, Mail, Phone, MapPin, FileEdit } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function createClient(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const notes = formData.get('notes') as string;

  if (!name) return;

  await prisma.client.create({
    data: {
      name,
      email,
      phone,
      address,
      notes
    }
  });

  revalidatePath('/clients');
  redirect('/clients');
}

export default function NewClientPage() {
  return (
    <div className="new-client-container">
      <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/clients" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <ChevronLeft size={16} />
          Retour à la liste
        </Link>
        <h1 className="page-title">Nouveau Client</h1>
      </div>

      <form action={createClient} className="card" style={{ maxWidth: '800px' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
          <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
            <label className="label">Nom complet ou Entreprise *</label>
            <div className="input-with-icon">
              <User size={18} className="icon" />
              <input type="text" name="name" required className="input" placeholder="Ex: Jean Dupont" />
            </div>
          </div>

          <div className="form-field">
            <label className="label">Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="icon" />
              <input type="email" name="email" className="input" placeholder="jean.dupont@email.com" />
            </div>
          </div>

          <div className="form-field">
            <label className="label">Téléphone</label>
            <div className="input-with-icon">
              <Phone size={18} className="icon" />
              <input type="tel" name="phone" className="input" placeholder="06 12 34 56 78" />
            </div>
          </div>

          <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
            <label className="label">Adresse postale</label>
            <div className="input-with-icon">
              <MapPin size={18} className="icon" />
              <input type="text" name="address" className="input" placeholder="123 rue de la Paix, 75000 Paris" />
            </div>
          </div>

          <div className="form-field full-width" style={{ gridColumn: 'span 2' }}>
            <label className="label">Notes internes / Observations</label>
            <div className="input-with-icon">
              <FileEdit size={18} className="icon" style={{ alignSelf: 'flex-start', marginTop: '12px' }} />
              <textarea name="notes" className="input" rows={4} placeholder="Informations complémentaires, préférences de contact..." style={{ resize: 'vertical', paddingTop: '10px' }}></textarea>
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-xl)' }}>
          <Link href="/clients" className="btn btn-secondary">Annuler</Link>
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            Enregistrer le client
          </button>
        </div>
      </form>

      <style jsx>{`
        .label {
          display: block;
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-with-icon .icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .input-with-icon .input {
          padding-left: 40px;
        }
      `}</style>
    </div>
  );
}
