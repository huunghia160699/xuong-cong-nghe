export function Progress({ value, label }: { value: number; label?: string }) {
  return <div className="space-y-2"><div className="h-1.5 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-blue" style={{ width: `${value}%` }} /></div>{label && <div className="flex justify-between text-xs text-zinc-500"><span>{label}</span><span>{value}%</span></div>}</div>;
}
