use serde::Serialize;
use sysinfo::{Disks, Networks, System};

#[derive(Debug, Clone, Serialize)]
pub struct CpuSnapshot { pub name: String, pub usage: Option<f32>, pub frequency_mhz: Option<u64>, pub temperature_c: Option<f32> }
#[derive(Debug, Clone, Serialize)]
pub struct GpuSnapshot { pub name: String, pub usage: Option<f32>, pub temperature_c: Option<f32>, pub vram_used_mb: Option<u64>, pub vram_total_mb: Option<u64>, pub clock_mhz: Option<u64>, pub fan_percent: Option<f32>, pub power_w: Option<f32> }
#[derive(Debug, Clone, Serialize)]
pub struct MemorySnapshot { pub total_mb: u64, pub used_mb: u64, pub available_mb: u64, pub usage_percent: f32 }
#[derive(Debug, Clone, Serialize)]
pub struct DiskSnapshot { pub name: String, pub total_bytes: u64, pub used_bytes: u64, pub read_bytes_per_sec: Option<u64>, pub write_bytes_per_sec: Option<u64> }
#[derive(Debug, Clone, Serialize)]
pub struct NetworkSnapshot { pub name: String, pub download_bytes_per_sec: Option<u64>, pub upload_bytes_per_sec: Option<u64> }
#[derive(Debug, Clone, Serialize)]
pub struct BatterySnapshot { pub percent: Option<f32>, pub charging: Option<bool> }
#[derive(Debug, Clone, Serialize)]
pub struct FpsSnapshot { pub fps: Option<f32>, pub frame_time_ms: Option<f32>, pub average_fps: Option<f32>, pub one_percent_low: Option<f32>, pub point_one_percent_low: Option<f32> }
#[derive(Debug, Clone, Serialize)]
pub struct MonitoringSnapshot { pub timestamp: i64, pub cpu: CpuSnapshot, pub gpu: GpuSnapshot, pub memory: MemorySnapshot, pub disks: Vec<DiskSnapshot>, pub network: Vec<NetworkSnapshot>, pub battery: BatterySnapshot, pub fps: FpsSnapshot }

pub struct Monitor { system: System, disks: Disks, networks: Networks }

impl Monitor {
    pub fn new() -> Self { let mut system = System::new_all(); system.refresh_all(); Self { system, disks: Disks::new_with_refreshed_list(), networks: Networks::new_with_refreshed_list() } }

    pub fn snapshot(&mut self) -> MonitoringSnapshot {
        self.system.refresh_cpu_all();
        self.system.refresh_memory();
        self.disks.refresh(true);
        self.networks.refresh(true);
        let cpu = self.system.cpus().first();
        let total = self.system.total_memory() / 1024 / 1024;
        let used = self.system.used_memory() / 1024 / 1024;
        let available = self.system.available_memory() / 1024 / 1024;
        let disks = self.disks.list().iter().map(|d| DiskSnapshot { name: d.name().to_string_lossy().to_string(), total_bytes: d.total_space(), used_bytes: d.total_space().saturating_sub(d.available_space()), read_bytes_per_sec: None, write_bytes_per_sec: None }).collect();
        let network = self.networks.iter().map(|(name, data)| NetworkSnapshot { name: name.clone(), download_bytes_per_sec: None, upload_bytes_per_sec: None }).collect();
        MonitoringSnapshot {
            timestamp: chrono::Utc::now().timestamp_millis(),
            cpu: CpuSnapshot { name: cpu.map(|c| c.brand().to_string()).unwrap_or_else(|| "CPU".into()), usage: cpu.map(|c| c.cpu_usage()), frequency_mhz: cpu.map(|c| c.frequency()), temperature_c: None },
            gpu: GpuSnapshot { name: "Unavailable".into(), usage: None, temperature_c: None, vram_used_mb: None, vram_total_mb: None, clock_mhz: None, fan_percent: None, power_w: None },
            memory: MemorySnapshot { total_mb: total, used_mb: used, available_mb: available, usage_percent: if total > 0 { used as f32 / total as f32 * 100.0 } else { 0.0 } },
            disks, network,
            battery: BatterySnapshot { percent: None, charging: None },
            fps: FpsSnapshot { fps: None, frame_time_ms: None, average_fps: None, one_percent_low: None, point_one_percent_low: None },
        }
    }
}
