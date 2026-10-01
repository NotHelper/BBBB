mod commands;
mod monitoring;

use commands::{get_monitoring_snapshot, set_monitoring_enabled, set_polling_interval, AppState};
use monitoring::Monitor;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state = AppState { monitor: Mutex::new(Monitor::new()), enabled: Mutex::new(true), interval_ms: Mutex::new(1000) };
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![get_monitoring_snapshot, set_monitoring_enabled, set_polling_interval])
        .run(tauri::generate_context!())
        .expect("error while running Brail Performance Monitor");
}
