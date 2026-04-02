'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  Send, 
  RefreshCw, 
  Mic, 
  History, 
  Plus,
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import MermaidRenderer from './MermaidRenderer';

const SAMPLE_TEXT = `Dépôt de l'animal par le client
Si animal dangereux -> Contention spécifique
Si animal calme -> Mise en cage standard
Trajet Lyon-Paris
Livraison au destinataire
Signature du bon de transport`;

const parseTextToMermaid = (text: string) => {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  let mermaid = 'graph TD\n';
  let lastNode = 'START';
  mermaid += `  START["Début"]\n`;

  lines.forEach((line, index) => {
    const cleanLine = line.trim();
    const nodeId = `N${index}`;
    
    if (cleanLine.toLowerCase().startsWith('si ')) {
      const decisionText = cleanLine.substring(3).split('->')[0].trim();
      const actionText = cleanLine.split('->')[1]?.trim() || "Action";
      
      mermaid += `  ${lastNode} --> ${nodeId}{${decisionText}}\n`;
      const nextActionId = `A${index}`;
      mermaid += `  ${nodeId} --> |Oui| ${nextActionId}[${actionText}]\n`;
      lastNode = nextActionId;
    } else {
      mermaid += `  ${lastNode} --> ${nodeId}[${cleanLine}]\n`;
      lastNode = nodeId;
    }
  });

  mermaid += `  ${lastNode} --> END["Fin"]\n`;
  return mermaid;
};

export default function DiagramDashboard() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [mermaidCode, setMermaidCode] = useState(parseTextToMermaid(SAMPLE_TEXT));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setMermaidCode(parseTextToMermaid(inputText));
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="diagram-dashboard-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr', gap: 'var(--spacing-xl)', height: 'calc(100vh - 200px)' }}>
      {/* Input Side */}
      <div className="input-side" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch size={18} color="var(--accent)" />
              Saisie du processus
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setInputText('')}>Vider</button>
          </div>

          <textarea 
            className="input" 
            style={{ flex: 1, resize: 'none', fontFamily: 'monospace', fontSize: '0.875rem', padding: '15px', background: '#f8fafc' }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Décrivez votre processus ligne par ligne. Utilisez 'Si condition -> action' pour les décisions."
          />

          <div className="input-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <RefreshCw size={18} className="spin" /> : <Send size={18} />}
              Générer le logigramme
            </button>
            <button className="btn btn-secondary" title="Transcription vocale (Simulée)">
              <Mic size={18} />
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '15px', background: '#f0f9ff', borderColor: '#dbeafe' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <HelpCircle size={18} color="#0369a1" />
            <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>
              <strong>Aide au formatage :</strong>
              <ul style={{ paddingLeft: '15px', marginTop: '5px' }}>
                <li>Une ligne = une étape</li>
                <li>Utilisez <code>Si [condition] {"->"} [action]</code> pour un embranchement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="preview-side">
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div className="preview-header" style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem' }}>Aperçu du diagramme</h3>
            <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
               <button className="btn btn-secondary btn-sm">Exporter SVG</button>
               <button className="btn btn-secondary btn-sm">Enregistrer</button>
            </div>
          </div>
          
          <div className="preview-body" style={{ flex: 1, background: '#fcfcfc', overflow: 'auto', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MermaidRenderer chart={mermaidCode} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
