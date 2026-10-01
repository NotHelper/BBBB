export type SensorState = 'available' | 'unavailable' | 'error';
export type Metric = number | null;

export interface CpuSnapshot { name: string; usage: Metric; frequencyMHz: Metric; temperatureC: Metric; }
export interface GpuSnapshot { name: string; usage: Metric; temperatureC: Metric; vramUsedMB: Metric; vramTotalMB: Metric; clockMHz: Metric; fanPercent: Metric; powerW: Metric; }
export interface MemorySnapshot { totalMB: number; usedMB: number; availableMB: number; usagePercent: number; }
export interface DiskSnapshot { name: string; totalBytes: number; usedBytes: number; readBytesPerSec: number; writeBytesPerSec: number; }
export interface NetworkSnapshot { name: string; downloadBytesPerSec: number; uploadBytesPerSec: number; }
export interface BatterySnapshot { percent: Metric; charging: boolean | null; }
export interface FpsSnapshot { fps: Metric; frameTimeMs: Metric; averageFps: Metric; onePercentLow: Metric; pointOnePercentLow: Metric; }
export interface MonitoringSnapshot {
  timestamp: number;
  cpu: CpuSnapshot;
  gpu: GpuSnapshot;
  memory: MemorySnapshot;
  disks: DiskSnapshot[];
  network: NetworkSnapshot[];
  battery: BatterySnapshot;
  fps: FpsSnapshot;
}
