'use client';

import { useState, useEffect } from 'react';
import { Cloud, Upload, Download, CheckCircle, AlertCircle, Loader, Info } from 'lucide-react';
import { initGoogleDrive, authenticateGoogle, saveToDrive, loadFromDrive, resolvePath } from '@/utils/googleDrive';

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

  const [clientId, setClientId] = useState('867619813314-h3gf1ro6fn1ddotkttso119lbiphi2rv.apps.googleusercontent.com');
  const [syncPath, setSyncPath] = useState('DigitalSaurien/AUTOMATE/DigitalSaurien');
  const [isAutoSync, setIsAutoSync] = useState(true);

  const [showDiag, setShowDiag] = useState(false);
  const [diagUrl, setDiagUrl] = useState('');
  const [diagResults, setDiagResults] = useState<{ step: string; status: 'pending' | 'ok' | 'error'; detail?: string }[]>([]);

  const runDiagnostics = async () => {
    setShowDiag(true);
    const results: typeof diagResults = [];
    const updateRes = (res: typeof diagResults) => setDiagResults([...res]);

    results.push({ step: 'Initialisation GAPI & GIS', status: isInited ? 'ok' : 'error', detail: isInited ? undefined : 'Scripts introuvables' });
    updateRes(results);
    if (!isInited) return;

    const token = (window as any).gapi?.client?.getToken();
    results.push({ step: 'Jeton OAuth (Token)', status: token ? 'ok' : 'error', detail: token ? undefined : 'Aucun token valide trouvé' });
    updateRes(results);
    if (!token) return;

    try {
      results.push({ step: 'Ping API Drive', status: 'pending' });
      updateRes(results);
      const res = await (window as any).gapi.client.drive.about.get({ fields: 'user(displayName, emailAddress)' });
      results[results.length - 1] = { step: 'Ping API Drive', status: 'ok', detail: `Connecté : ${res.result.user.emailAddress}` };
      updateRes(results);
    } catch (err: any) {
      results[results.length - 1] = { step: 'Ping API Drive', status: 'error', detail: err?.result?.error?.message || 'Impossible de joindre Google Drive' };
      updateRes(results);
      return;
    }

    try {
      results.push({ step: `Vérification du dossier`, status: 'pending' });
      updateRes(results);
      const targetId = await resolvePath(syncPath);
      results[results.length - 1] = { step: `Vérification du dossier`, status: 'ok', detail: `Dossier validé (ID: ${targetId})` };
      updateRes(results);
    } catch (err: any) {
      results[results.length - 1] = { step: `Vérification du dossier`, status: 'error', detail: err?.result?.error?.message || 'Dossier introuvable ou droits insuffisants' };
      updateRes(results);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') setDiagUrl(window.location.origin);
    const savedAutoSync = localStorage.getItem('ds_auto_sync');
    if (savedAutoSync !== null) setIsAutoSync(savedAutoSync === 'true');
    const savedPath = localStorage.getItem('ds_sync_path');
    if (savedPath) setSyncPath(savedPath);
    const savedClientId = localStorage.getItem('ds_client_id');
    if (savedClientId) setClientId(savedClientId);

    initGoogleDrive(savedClientId || undefined).then(res => setIsInited(!!res));
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
      const res = await saveToDrive(data, syncPath);
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
      const data = await loadFromDrive(syncPath);
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Chemin ou ID Google Drive</label>
          <input 
            className="input-modern" 
            value={syncPath} 
            onChange={e => { setSyncPath(e.target.value); localStorage.setItem('ds_sync_path', e.target.value); }} 
            placeholder="DigitalSaurien/AUTOMATE/DigitalSaurien"
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Client ID OAuth</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              className="input-modern" 
              value={clientId} 
              onChange={e => setClientId(e.target.value)} 
            />
            <button className="btn-wow" style={{ fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => {
              localStorage.setItem('ds_client_id', clientId);
              initGoogleDrive(clientId);
              setIsInited(false);
              setIsAuthed(false);
            }}>Appliquer</button>
          </div>
        </div>
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
              {isLoading ? <Loader size={16} /> : <Upload size={16} />}
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
              <Download size={16} />
              Restaurer depuis Drive
            </button>
          </>
        )}

        <button
          onClick={(e) => { e.preventDefault(); runDiagnostics(); }}
          style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto' }}
        >
          <Info size={16} />
          Diagnostic Complet
        </button>

        {isAuthed && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-glass)', padding: '12px', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}>
            <div>
              <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>Synchronisation automatique</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sauvegarde automatiquement en tâche de fond.</span>
            </div>
            <input type="checkbox" checked={isAutoSync} onChange={(e) => {
              setIsAutoSync(e.target.checked);
              localStorage.setItem('ds_auto_sync', String(e.target.checked));
            }} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
          </div>
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

      {/* Diagnostic Modal */}
      {showDiag && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowDiag(false)}>
          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', maxWidth: '600px', width: '100%', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginTop: 0 }}>
              <Info size={24} /> Outil de Diagnostic Drive
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              Analysez la liaison avec Google Drive en temps réel pour détecter les erreurs (ID invalide, dossier manquant, problème CORS...).
            </p>
            
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {diagResults.map((r, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '8px', background: r.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : r.status === 'ok' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)', borderLeft: `4px solid ${r.status === 'error' ? 'var(--error)' : r.status === 'ok' ? '#10b981' : 'var(--text-muted)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, color: r.status === 'error' ? 'var(--error)' : r.status === 'ok' ? '#10b981' : 'var(--text-main)' }}>
                    <span>{r.step}</span>
                    {r.status === 'pending' ? <Loader size={16} className="spin" /> : r.status === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  </div>
                  {r.detail && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>{r.detail}</p>}
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--bg-glass)', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>URL à rajouter dans "Origines autorisées" (pour Erreur 400) :</p>
              <code style={{ display: 'block', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', color: '#10b981', userSelect: 'all', fontSize: '0.95rem' }}>
                {diagUrl}
              </code>
            </div>

            <button className="btn-wow" style={{ marginTop: '10px', width: '100%', padding: '12px' }} onClick={() => setShowDiag(false)}>
              Fermer le diagnostic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
