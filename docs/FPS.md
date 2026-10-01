# FPS and frame-time methodology

The statistics module treats frame time as the primary sample. 1% low is calculated from the slowest 1% of valid frame-time samples: their mean frame time is converted to FPS. 0.1% low uses the slowest 0.1% in the same way.

The native FPS provider is intentionally not simulated. A future Windows provider should feed presentation timestamps from PresentMon/ETW into this calculation layer.
