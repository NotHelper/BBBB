# Brail Performance Monitor

**Lightweight. Powerful. Built for Gamers.**

Brail Performance Monitor is a Windows-first Tauri 2 + React + TypeScript + Rust desktop monitor. Core telemetry is local/offline and the native layer is responsible for hardware collection.

## Current implementation

- Tauri 2.12 / Rust native backend
- React 19.3 / TypeScript 5.9 frontend
- Centralized Zustand monitoring store
- Bounded in-memory history
- Real CPU utilization/frequency/name via `sysinfo`
- Real RAM utilization via `sysinfo`
- Real drive capacity information via `sysinfo`
- Real network adapter counters via `sysinfo` (rate calculation is reserved for the next provider pass)
- Explicit `Unavailable` values for telemetry that is not yet backed by a provider
- Dark, low-clutter dashboard and settings screen
- Configurable polling intervals: 250/500/1000/2000/5000 ms
- Tauri Windows MSI/NSIS packaging configuration

## Important limitation

This repository is a buildable engineering foundation, not a claim that every requested hardware sensor/FPS/overlay feature is complete. GPU telemetry, PresentMon/ETW FPS capture, native click-through overlay, profiles, alerts, recording, tray, and installers require Windows-side validation and additional native providers. The application deliberately reports those capabilities as unavailable until a provider is implemented.

## Requirements on Windows

- Windows 10/11 x64
- Node.js 24 LTS recommended
- Rust stable toolchain
- Microsoft C++ Build Tools
- WebView2

Tauri 2.12 is pinned in this project. Node 24 LTS is the recommended JavaScript runtime.

## Build

```powershell
npm install
npm run build
npm run tauri build
```

For development:

```powershell
npm install
npm run tauri:dev
```

The generated installer/bundles are written below `src-tauri/target/release/bundle/` after a successful Windows build.

## Tests

```powershell
npm run test
npm run build
```

Rust tests can be run with:

```powershell
cd src-tauri
cargo test
```

## Architecture

```text
React UI
  -> Zustand monitoring store
  -> Tauri IPC
  -> Rust monitoring engine
      -> provider abstraction
      -> CPU/RAM/Disk/Network providers
      -> future GPU/FPS/overlay providers
```

The UI never directly polls Windows hardware APIs.
