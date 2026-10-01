# Hardware support

## Implemented

- CPU model, utilization and frequency: `sysinfo`
- System memory totals/used/available: `sysinfo`
- Drive identity and capacity: `sysinfo`
- Network adapter identity/counters: `sysinfo`

## Capability-gated / pending native providers

- CPU temperature
- GPU utilization/temperature/VRAM/clocks/fan/power
- Battery percentage/charging
- FPS/frame time/1% low/0.1% low
- Disk read/write throughput

The UI must display `Unavailable` when a provider cannot supply a reading.
