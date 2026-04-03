import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import AutomationQuoteForm from '@/components/quotes/AutomationQuoteForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

async function getData() {
  const [clients, settings] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: 'asc' } }),
    prisma.pricingSettings.findFirst()
  ]);
  
  const defaultPricing = {
    hourlyRate: 60.0,
    travelHourlyRate: 35.0,
    hardshipThreshold: 8.0,
    hardshipSurcharge: 1.2,
    fuelPriceDefault: 1.85,
    complexityCoeffs: JSON.stringify({ basic: 1, medium: 1.3, high: 1.8 }),
    multiToolCoeffs: JSON.stringify({ base: 1.1 }),
    multiIACoeffs: JSON.stringify({ base: 1.25 }),
    riskCoeffs: JSON.stringify({ low: 1, med: 1.2, high: 1.5 }),
    accountCreationCost: 50.0,
    subscriptionSetupCost: 30.0,
  };

  return { 
    clients, 
    settings: (settings as any) || defaultPricing 
  };
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
