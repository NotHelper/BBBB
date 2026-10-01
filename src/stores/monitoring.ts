import { create } from 'zustand';
import type { MonitoringSnapshot } from '../types/monitoring';
import { readMonitoringSnapshot } from '../services/native';

const empty: MonitoringSnapshot = {
  timestamp: Date.now(),
  cpu: { name: 'CPU', usage: null, frequencyMHz: null, temperatureC: null },
  gpu: { name: 'GPU', usage: null, temperatureC: null, vramUsedMB: null, vramTotalMB: null, clockMHz: null, fanPercent: null, powerW: null },
  memory: { totalMB: 0, usedMB: 0, availableMB: 0, usagePercent: 0 },
  disks: [], network: [],
  battery: { percent: null, charging: null },
  fps: { fps: null, frameTimeMs: null, averageFps: null, onePercentLow: null, pointOnePercentLow: null },
};

interface MonitoringStore {
  snapshot: MonitoringSnapshot;
  history: MonitoringSnapshot[];
  enabled: boolean;
  intervalMs: number;
  error: string | null;
  start: () => void;
  stop: () => void;
  setIntervalMs: (ms: number) => void;
}

let timer: number | undefined;

export const useMonitoringStore = create<MonitoringStore>((set, get) => ({
  snapshot: empty,
  history: [],
  enabled: true,
  intervalMs: 1000,
  error: null,
  start: () => {
    if (timer) window.clearInterval(timer);
    const poll = async () => {
      try {
        const next = await readMonitoringSnapshot();
        set((state) => ({ snapshot: next, history: [...state.history.slice(-299), next], error: null }));
      } catch (error) {
        set({ error: error instanceof Error ? error.message : String(error) });
      }
    };
    void poll();
    timer = window.setInterval(poll, get().intervalMs);
  },
  stop: () => { if (timer) window.clearInterval(timer); timer = undefined; },
  setIntervalMs: (ms) => {
    set({ intervalMs: ms });
    get().start();
  },
}));
