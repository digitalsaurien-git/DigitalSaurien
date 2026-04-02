'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize and render on client
    if (typeof window !== 'undefined') {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#fff',
          primaryBorderColor: '#1e3a8a',
          lineColor: '#64748b',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#f1f5f9',
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
      });
    }

    const render = async () => {
      if (!chart) return;
      try {
        setError(null);
        const { svg: generatedSvg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
        setSvg(generatedSvg);
      } catch (err: any) {
        console.error('Mermaid Render Error:', err);
        setError('Erreur de rendu du diagramme. Vérifiez la syntaxe.');
      }
    };

    render();
  }, [chart]);

  if (error) {
    return (
      <div className="mermaid-error" style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.875rem' }}>
        {error}
      </div>
    );
  }

  return (
    <div 
      className="mermaid-container" 
      dangerouslySetInnerHTML={{ __html: svg }} 
      style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'white', padding: '20px', borderRadius: '8px' }}
    />
  );
}
