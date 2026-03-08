import layoutCsv from './layout.csv?raw';

const layoutMap = new Map<string, number>();
for (const line of layoutCsv.trim().split('\n')) {
  const [key, value] = line.split(',');
  layoutMap.set(key.trim(), parseFloat(value));
}

export function coord(key: string): number {
  const val = layoutMap.get(key);
  if (val === undefined) throw new Error(`Unknown layout coordinate: ${key}`);
  return val;
}
