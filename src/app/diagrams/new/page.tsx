import React from 'react';
import DiagramDashboard from '@/components/diagrams/DiagramDashboard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewDiagramPage() {
  return (
    <div className="new-diagram-page">
      <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
          <ChevronLeft size={16} />
          Retour au tableau de bord
        </Link>
        <h1 className="page-title">Générateur de schémas de process</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Transformez vos descriptions textuelles en logigrammes clairs en un clic.</p>
      </div>

      <DiagramDashboard />
    </div>
  );
}
