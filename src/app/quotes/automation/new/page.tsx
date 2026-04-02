import React from 'react';
import { prisma } from '@/lib/db';
import AutomationQuoteForm from '@/components/quotes/AutomationQuoteForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

async function getData() {
  const [clients, settings] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: 'asc' } }),
    prisma.pricingSettings.findFirst()
  ]);
  
  return { clients, settings };
}

export default async function NewAutomationQuotePage() {
  const { clients, settings } = await getData();

  return (
    <div className="new-quote-page">
      <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <ChevronLeft size={16} />
          Retour au tableau de bord
        </Link>
        <h1 className="page-title">Devis Automatisation Digitale</h1>
      </div>

      <AutomationQuoteForm 
        clients={clients.map((c: any) => ({ id: c.id, name: c.name }))} 
        defaultSettings={settings} 
      />
    </div>
  );
}
