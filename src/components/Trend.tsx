interface Props { values: number[]; unit?: string; }
export function Trend({ values, unit = '' }: Props) {
  const nums = values.filter(Number.isFinite);
  if (nums.length < 2) return <div className="trend empty">Collecting history…</div>;
  const min = Math.min(...nums); const max = Math.max(...nums); const span = Math.max(max - min, 0.0001);
  const points = nums.slice(-60).map((v, i, a) => `${(i / Math.max(a.length - 1, 1)) * 100},${100 - ((v - min) / span) * 82 - 9}`).join(' ');
  return <div className="trend" aria-label={`Recent values ${unit}`}><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={points} fill="none" /></svg></div>;
}
