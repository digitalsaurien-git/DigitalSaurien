'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudUpload, CloudDownload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { initGoogleDrive, authenticateGoogle, saveToDrive, loadFromDrive } from '@/utils/googleDrive';

const KEYS = [
  'digitalsaurien_clients',
  'digitalsaurien_quotes', 
  'digitalsaurien_diagrams',
  'digitalsaurien_settings',
];

function getAllLocalData() {
  const data: Record<string, any> = {};
  KEYS.forEach(key => {
    try {
      const val = localStorage.getItem(key);
      if (val) data[key] = JSON.parse(val);
    } catch {}
  });
  return data;
}

function restoreAllLocalData(data: Record<string, any>) {
  KEYS.forEach(key => {
    if (data[key] !== undefined) {
      localStorage.setItem(key, JSON.stringify(data[key]));
    }
  });
}

export function SyncControls() {
  const [isInited, setIsInited] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    initGoogleDrive().then(res => setIsInited(!!res));
    const ls = localStorage.getItem('digitalsaurien_last_sync');
    if (ls) setLastSync(ls);
  }, []);

  const handleAuth = async () => {
    try {
      setStatus('loading');
      await authenticateGoogle();
      setIsAuthed(true);
      setStatus('idle');
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleSave = async () => {
    try {
      setStatus('loading');
      const data = getAllLocalData();
      const res = await saveToDrive(data);
      if (res) {
        const ts = new Date().toLocaleString('fr-FR');
        setLastSync(ts);
        localStorage.setItem('digitalsaurien_last_sync', ts);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleLoad = async () => {
    if (!confirm('⚠️ Cela va écraser vos données locales par celles du Drive. Continuer ?')) return;
    try {
      setStatus('loading');
      const data = await loadFromDrive();
      if (data) {
        restoreAllLocalData(data);
        setStatus('success');
        setTimeout(() => { setStatus('idle'); window.location.reload(); }, 1500);
      } else {
        alert('Aucun fichier de sauvegarde trouvé sur le Drive.');
        setStatus('idle');
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-lg)', borderLeft: '4px solid var(--accent)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Cloud size={22} color="var(--accent)" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Synchronisation Google Drive</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Sauvegardez vos clients, devis et paramètres dans votre Drive personnel
          </p>
        </div>
        {lastSync && (
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Dernière synchro : {lastSync}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {!isAuthed ? (
          <button
            onClick={handleAuth}
            disabled={!isInited || isLoading}
            className="btn-wow"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: 'var(--radius-md)', opacity: (!isInited || isLoading) ? 0.6 : 1 }}
          >
            {isLoading ? <Loader size={16} className="spin" /> : <Cloud size={16} />}
            {isLoading ? 'Connexion...' : 'Se connecter à Google Drive'}
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: '#10b981', color: 'white', fontWeight: 700, fontSize: '0.9rem',
                opacity: isLoading ? 0.6 : 1, transition: 'all 0.2s'
              }}
            >
              {isLoading ? <Loader size={16} /> : <CloudUpload size={16} />}
              Sauvegarder vers Drive
            </button>

            <button
              onClick={handleLoad}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                borderRadius: 'var(--radius-md)', border: '2px solid var(--border)',
                cursor: 'pointer', background: 'white', fontWeight: 700,
                fontSize: '0.9rem', opacity: isLoading ? 0.6 : 1, transition: 'all 0.2s'
              }}
            >
              <CloudDownload size={16} />
              Restaurer depuis Drive
            </button>
          </>
        )}

        {/* Status feedback */}
        {status === 'success' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
            <CheckCircle size={16} /> Succès !
          </span>
        )}
        {status === 'error' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', fontWeight: 600, fontSize: '0.85rem' }}>
            <AlertCircle size={16} /> Échec — vérifiez votre connexion Google
          </span>
        )}
      </div>

      {!isInited && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          ⏳ Initialisation de la bibliothèque Google en cours...
        </p>
      )}
    </div>
  );
}
