use std::sync::Mutex;
use tauri::State;
use crate::monitoring::{Monitor, MonitoringSnapshot};

pub struct AppState { pub monitor: Mutex<Monitor>, pub enabled: Mutex<bool>, pub interval_ms: Mutex<u64> }

#[tauri::command]
pub fn get_monitoring_snapshot(state: State<'_, AppState>) -> Result<MonitoringSnapshot, String> {
    if !*state.enabled.lock().map_err(|_| "monitor state lock poisoned")? { return Err("Monitoring is paused".into()); }
    let mut monitor = state.monitor.lock().map_err(|_| "monitor lock poisoned")?;
    Ok(monitor.snapshot())
}

#[tauri::command]
pub fn set_monitoring_enabled(state: State<'_, AppState>, enabled: bool) -> Result<(), String> { *state.enabled.lock().map_err(|_| "monitor state lock poisoned")? = enabled; Ok(()) }

#[tauri::command]
pub fn set_polling_interval(state: State<'_, AppState>, interval_ms: u64) -> Result<(), String> {
    if ![250, 500, 1000, 2000, 5000].contains(&interval_ms) { return Err("Unsupported polling interval".into()); }
    *state.interval_ms.lock().map_err(|_| "monitor state lock poisoned")? = interval_ms; Ok(())
}
