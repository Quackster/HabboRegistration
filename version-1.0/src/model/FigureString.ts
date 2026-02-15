import { PART_TYPES } from '../config';

export interface FigureSlice {
  modelId: string; // 3-digit style ID
  colorIdx: string; // 2-digit 1-based color index
}

export function parseFigureString(figure: string): FigureSlice[] {
  if (figure.length !== 25) {
    return PART_TYPES.map(() => ({ modelId: '001', colorIdx: '01' }));
  }
  const slices: FigureSlice[] = [];
  for (let i = 0; i < 5; i++) {
    const modelId = figure.substring(i * 5, i * 5 + 3);
    const colorIdx = figure.substring(i * 5 + 3, i * 5 + 5);
    slices.push({ modelId, colorIdx });
  }
  return slices;
}

export function encodeFigureString(slices: FigureSlice[]): string {
  return slices
    .map(s => {
      const model = s.modelId.padStart(3, '0');
      const color = s.colorIdx.padStart(2, '0');
      return model + color;
    })
    .join('');
}

export function padColorIndex(num: number): string {
  const s = String(num);
  return num < 10 ? '0' + s : s;
}
