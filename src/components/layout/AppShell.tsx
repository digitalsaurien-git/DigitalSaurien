import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Zap, 
  GitBranch, 
  History, 
  Settings,
  ChevronRight,
  Menu
} from 'lucide-react';
import './AppShell.css';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => (
  <Link href={href} className={`nav-item ${active ? 'active' : ''}`}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </Link>
);

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div className="logo">
              <span className="logo-icon"><Zap size={24} fill="#3b82f6" stroke="#3b82f6" /></span>
              <span className="logo-text">DigitalSaurien</span>
            </div>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Tableau de bord" active />
            <NavItem href="/clients" icon={<Users size={20} />} label="Clients" />
          </div>

          <div className="nav-section-title">Devis</div>
          <div className="nav-group">
            <NavItem href="/quotes/delivery/new" icon={<Truck size={20} />} label="Livraison Animaux" />
            <NavItem href="/quotes/automation/new" icon={<Zap size={20} />} label="Automatisation IT" />
          </div>

          <div className="nav-section-title">Outils</div>
          <div className="nav-group">
            <NavItem href="/diagrams/new" icon={<GitBranch size={20} />} label="Générateur de schémas" />
            <NavItem href="/history" icon={<History size={20} />} label="Historique complet" />
          </div>
        </nav>

        <div className="sidebar-footer">
          <NavItem href="/settings" icon={<Settings size={20} />} label="Paramètres" />
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn"><Menu size={20} /></button>
            <h1 className="page-title">Tableau de bord</h1>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">DR</div>
              <span className="user-name">Digital Saurien</span>
            </div>
          </div>
        </header>
        
        <section className="content-inner">
          {children}
        </section>
      </main>
    </div>
  );
};
