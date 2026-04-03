'use client'

import { useState, useEffect } from 'react'
import { initGoogleDrive, authenticateGoogle, saveToDrive, loadFromDrive } from '@/utils/googleDrive'
import { exportDatabaseData, importDatabaseData } from '@/app/actions/sync'

export function SyncControls() {
  const [isInited, setIsInited] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const res = await initGoogleDrive()
      setIsInited(res)
    }
    init()
  }, [])

  const handleAuth = async () => {
    try {
      setIsLoading(true)
      await authenticateGoogle()
      setIsAuthed(true)
    } catch (error) {
      console.error("Auth Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const data = await exportDatabaseData()
      const res = await saveToDrive(data)
      if (res) {
        setLastSync(new Date().toLocaleString())
        alert("✅ Sauvegarde réussie sur Google Drive !")
      }
    } catch (error) {
      alert("❌ Échec de la sauvegarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = async () => {
    if (!confirm("⚠️ Attention : Cela va écraser vos données locales actuelles par celles du Drive. Continuer ?")) return

    try {
      setIsLoading(true)
      const data = await loadFromDrive()
      if (data) {
        await importDatabaseData(data)
        alert("✅ Restauration réussie ! Rechargez la page pour voir les changements.")
        window.location.reload()
      } else {
        alert("🔍 Aucun fichier de sauvegarde trouvé sur le Drive.")
      }
    } catch (error) {
      alert("❌ Échec de la restauration.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="settings-section">
      <h3>☁️ Synchronisation Cloud</h3>
      <p className="section-description">
        Sauvegardez et restaurez vos données (Clients, Devis, Schémas) via votre Google Drive personnel.
      </p>

      <div className="sync-actions">
        {!isAuthed ? (
          <button 
            className="btn btn-primary" 
            onClick={handleAuth}
            disabled={!isInited || isLoading}
          >
            {isLoading ? "Initialisation..." : "Se connecter à Google Drive"}
          </button>
        ) : (
          <div className="btn-group">
            <button 
              className="btn btn-success" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Sauvegarde..." : "🚀 Sauvegarder vers Drive"}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={handleLoad}
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "📥 Restaurer depuis Drive"}
            </button>
          </div>
        )}
      </div>

      {lastSync && (
        <span className="sync-timestamp">Dernière synchro : {lastSync}</span>
      )}

      <style jsx>{`
        .settings-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        h3 {
          margin: 0 0 8px 0;
          color: #fff;
          font-size: 1.25rem;
        }
        .section-description {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .sync-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .btn-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        .btn-success {
          background: #10b981;
          color: white;
        }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e2e8f0;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .sync-timestamp {
          font-size: 0.8rem;
          color: #64748b;
          display: block;
        }
      `}</style>
    </div>
  )
}
