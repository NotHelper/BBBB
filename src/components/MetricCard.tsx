import type { ReactNode } from 'react';

interface Props { title: string; value: string; secondary?: string; footer?: ReactNode; }
export function MetricCard({ title, value, secondary, footer }: Props) {
  return <section className="metric-card">
    <div className="metric-head"><span>{title}</span><span className="live-dot" /></div>
    <div className="metric-value">{value}</div>
    {secondary && <div className="metric-secondary">{secondary}</div>}
    {footer}
  </section>;
}
