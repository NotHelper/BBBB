import { useEffect, useMemo, useState } from 'react';
import { Activity, Cpu, Gauge, HardDrive, MemoryStick, Monitor, Network, Settings, Battery, Play, Pause } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { Trend } from './components/Trend';
import { useMonitoringStore } from './stores/monitoring';
import { setMonitoringEnabled } from './services/native';

function fmt(v: number | null, suffix = '') { return v == null || !Number.isFinite(v) ? 'Unavailable' : `${v.toFixed(v >= 100 ? 0 : 1)}${suffix}`; }
function mb(v: number) { return v >= 1024 ? `${(v / 1024).toFixed(1)} GB` : `${v.toFixed(0)} MB`; }

export default function App() {
  const { snapshot, history, enabled, intervalMs, error, start, stop, setIntervalMs } = useMonitoringStore();
  const [page, setPage] = useState<'dashboard'|'settings'>('dashboard');
  useEffect(() => { start(); return () => stop(); }, [start, stop]);
  const cpuHistory = useMemo(() => history.map(x => x.cpu.usage ?? NaN), [history]);
  const gpuHistory = useMemo(() => history.map(x => x.gpu.usage ?? NaN), [history]);
  const ramHistory = useMemo(() => history.map(x => x.memory.usagePercent), [history]);
  const toggle = async () => { const next = !enabled; await setMonitoringEnabled(next).catch(() => undefined); if (next) start(); else stop(); };
  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">B</div><div><strong>BRAIL</strong><span>PERFORMANCE MONITOR</span></div></div>
      <div className="status"><span className={enabled ? 'status-dot on' : 'status-dot'} /> {enabled ? 'Monitoring' : 'Paused'}</div>
      <nav><button className={page === 'dashboard' ? 'nav active' : 'nav'} onClick={() => setPage('dashboard')}><Monitor size={16}/> Dashboard</button><button className={page === 'settings' ? 'nav active' : 'nav'} onClick={() => setPage('settings')}><Settings size={16}/> Settings</button><button className="icon-button" onClick={toggle} title={enabled ? 'Pause monitoring' : 'Resume monitoring'}>{enabled ? <Pause size={17}/> : <Play size={17}/>}</button></nav>
    </header>
    {error && <div className="error-banner">Native monitor unavailable: {error}. Start this application through Tauri to access real hardware data.</div>}
    {page === 'dashboard' ? <main>
      <div className="hero"><div><div className="eyebrow">LIVE SYSTEM TELEMETRY</div><h1>Performance at a glance.</h1><p>Real local measurements. No cloud service. Unsupported sensors remain unavailable.</p></div><div className="interval"><Activity size={16}/> {intervalMs} ms</div></div>
      <div className="grid">
        <MetricCard title="CPU" value={fmt(snapshot.cpu.usage, '%')} secondary={`${fmt(snapshot.cpu.temperatureC, '°C')}  ·  ${fmt(snapshot.cpu.frequencyMHz, ' MHz')}`} footer={<Trend values={cpuHistory}/>} />
        <MetricCard title="GPU" value={fmt(snapshot.gpu.usage, '%')} secondary={`${fmt(snapshot.gpu.temperatureC, '°C')}  ·  ${fmt(snapshot.gpu.clockMHz, ' MHz')}`} footer={<Trend values={gpuHistory}/>} />
        <MetricCard title="MEMORY" value={mb(snapshot.memory.usedMB)} secondary={`${snapshot.memory.usagePercent.toFixed(0)}%  ·  ${mb(snapshot.memory.totalMB)} total`} footer={<Trend values={ramHistory}/>} />
        <MetricCard title="FPS" value={fmt(snapshot.fps.fps)} secondary={`${fmt(snapshot.fps.frameTimeMs, ' ms')} frame time`} footer={<div className="stat-row"><span>1% LOW <b>{fmt(snapshot.fps.onePercentLow)}</b></span><span>0.1% LOW <b>{fmt(snapshot.fps.pointOnePercentLow)}</b></span></div>} />
      </div>
      <section className="wide-panel"><div className="panel-head"><div><span className="eyebrow">SYSTEM</span><h2>Devices & throughput</h2></div><span className="muted">{new Date(snapshot.timestamp).toLocaleTimeString()}</span></div><div className="device-grid">
        <div className="device"><HardDrive/><div><b>Storage</b><span>{snapshot.disks.length ? snapshot.disks.map(d => d.name).join(' · ') : 'Unavailable'}</span></div></div>
        <div className="device"><Network/><div><b>Network</b><span>{snapshot.network.length ? snapshot.network.map(n => n.name).join(' · ') : 'Unavailable'}</span></div></div>
        <div className="device"><Battery/><div><b>Battery</b><span>{snapshot.battery.percent == null ? 'Desktop / unavailable' : `${fmt(snapshot.battery.percent, '%')}${snapshot.battery.charging ? ' · Charging' : ''}`}</span></div></div>
        <div className="device"><Cpu/><div><b>Processor</b><span>{snapshot.cpu.name}</span></div></div>
      </div></section>
      <section className="wide-panel graph-panel"><div className="panel-head"><div><span className="eyebrow">HISTORY</span><h2>Recent utilization</h2></div><Gauge size={18}/></div><div className="big-graph"><Trend values={cpuHistory}/><div className="graph-label">CPU utilization · bounded 5-minute dashboard history</div></div></section>
    </main> : <main><section className="settings-panel"><div className="eyebrow">CONFIGURATION</div><h1>Monitoring settings</h1><p>Polling is performed by the Rust native engine. Choose a bounded update interval.</p><label>Sensor polling interval<select value={intervalMs} onChange={e => setIntervalMs(Number(e.target.value))}>{[250,500,1000,2000,5000].map(v => <option key={v} value={v}>{v} ms</option>)}</select></label><div className="setting-note"><MemoryStick size={18}/><div><b>Low-overhead design</b><span>History stays bounded in memory and the frontend subscribes to one centralized monitoring store.</span></div></div></section></main>}
    <footer><span>Lightweight. Powerful. Built for Gamers.</span><span>Brail Performance Monitor · Native engine</span></footer>
  </div>;
}
