import { invoke } from '@tauri-apps/api/core';
import type { MonitoringSnapshot } from '../types/monitoring';

export async function readMonitoringSnapshot(): Promise<MonitoringSnapshot> {
  return invoke<MonitoringSnapshot>('get_monitoring_snapshot');
}

export async function setMonitoringEnabled(enabled: boolean): Promise<void> {
  await invoke('set_monitoring_enabled', { enabled });
}

export async function setPollingInterval(intervalMs: number): Promise<void> {
  await invoke('set_polling_interval', { intervalMs });
}
