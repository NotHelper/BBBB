# Architecture

The project is intentionally split into a presentation layer and a native monitoring layer.

## Native layer

`src-tauri/src/monitoring` owns normalized snapshots. Providers should return optional readings so missing sensors are represented as unavailable rather than invented.

The intended provider boundaries are:

- Windows performance counters: CPU/process/system counters
- Windows power APIs: battery/power state
- DXGI/vendor APIs: GPU identity and utilization where supported
- PresentMon/ETW: frame presentation and frame-time telemetry
- Native overlay: separate lightweight transparent click-through window

## IPC

The frontend currently invokes `get_monitoring_snapshot` at a configurable interval. As the engine grows, this should be replaced by a batched event/channel stream to avoid unnecessary IPC work.

## Resource control

History is bounded. The dashboard keeps one normalized snapshot per sample. Graphs render a limited number of points and do not create one DOM node per sample.
