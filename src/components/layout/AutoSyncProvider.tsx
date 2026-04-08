'use client';

import { useEffect, useRef } from 'react';
import { initGoogleDrive, saveToDrive } from '@/utils/googleDrive';

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

export function AutoSyncProvider() {
  const lastState = useRef<string>('');

  useEffect(() => {
    const handlePoll = async () => {
      // Is auto sync enabled? Note we read it dynamically each time
      const autoSync = localStorage.getItem('ds_auto_sync') !== 'false';
      if (!autoSync) return;

      const clientId = localStorage.getItem('ds_client_id');
      
      // Attempt init in background if not already done
      // It returns fast if already initialized
      await initGoogleDrive(clientId || undefined);

      const currentData = JSON.stringify(getAllLocalData());
      
      if (lastState.current && currentData !== lastState.current) {
        // Data changed! Trigger save if authed
        const path = localStorage.getItem('ds_sync_path') || 'DigitalSaurien/AUTOMATE/DigitalSaurien';
        // Note: saveToDrive returns false if token isn't present
        const res = await saveToDrive(getAllLocalData(), path);
        if (res) {
          localStorage.setItem('digitalsaurien_last_sync', new Date().toLocaleString('fr-FR') + ' (Auto)');
        }
      }
      
      lastState.current = currentData;
    };

    // Initial capture
    lastState.current = JSON.stringify(getAllLocalData());

    const interval = setInterval(handlePoll, 3000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
