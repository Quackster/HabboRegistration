export interface StyleParts {
  [partType: string]: string; // e.g. { ch: "021", ls: "002", rs: "002" }
}

export interface StyleData {
  indexNum: number;
  parts: StyleParts;
  colors: string[];
}

export interface GenderData {
  [partType: string]: {
    [styleId: string]: StyleData;
  };
}

// Count of styles per part type per gender
export interface StyleCounts {
  [partType: string]: number;
}

let maleData: GenderData = {};
let femaleData: GenderData = {};
let maleCounts: StyleCounts = {};
let femaleCounts: StyleCounts = {};

export async function loadFigureData(url: string): Promise<void> {
  const resp = await fetch(url);
  const text = await resp.text();

  maleData = {};
  femaleData = {};
  maleCounts = {};
  femaleCounts = {};

  // Track style index per gender+partType
  const indexCounters: Record<string, number> = {};

  const lines = text.split('\n');
  for (const line of lines) {
    if (!line) continue;
    // gender,partType,styleId,parts,colors
    const [gender, partType, styleId, partsStr, colorsStr] = line.split(',');

    const data = gender === 'M' ? maleData : femaleData;
    const counts = gender === 'M' ? maleCounts : femaleCounts;

    if (!data[partType]) data[partType] = {};

    const counterKey = `${gender}:${partType}`;
    if (indexCounters[counterKey] === undefined) indexCounters[counterKey] = 0;
    const indexNum = indexCounters[counterKey]++;
    counts[partType] = indexCounters[counterKey];

    const parts: StyleParts = {};
    if (partsStr) {
      for (const pair of partsStr.split('|')) {
        const [pType, pValue] = pair.split(':');
        parts[pType] = pValue;
      }
    }

    const colors = colorsStr ? colorsStr.split('|') : [];

    data[partType][styleId] = { indexNum, parts, colors };
  }
}

function getGenderData(gender: string): GenderData {
  return gender === 'female' || gender === 'F' ? femaleData : maleData;
}

function getGenderCounts(gender: string): StyleCounts {
  return gender === 'female' || gender === 'F' ? femaleCounts : maleCounts;
}

function normalizeGender(g: string): string {
  if (g === 'M') return 'male';
  if (g === 'F') return 'female';
  return g;
}

export function getPartAndColor(
  figureSlice: [string, string], // [3-digit modelId, 2-digit colorIdx]
  gender: string
): { color: string; partType: string; subParts: [string, string][] } | null {
  gender = normalizeGender(gender);
  const data = getGenderData(gender);
  const modelId = parseInt(figureSlice[0], 10);
  const colorIdx = parseInt(figureSlice[1], 10) - 1;

  for (const partType of Object.keys(data)) {
    const styles = data[partType];
    for (const styleId of Object.keys(styles)) {
      if (Number(styleId) === modelId) {
        const style = styles[styleId];
        const color = style.colors[colorIdx] || 'FFFFFF';
        const subParts: [string, string][] = [];
        for (const [pType, pModel] of Object.entries(style.parts)) {
          subParts.push([pType, pModel]);
        }
        return { color, partType, subParts };
      }
    }
  }
  return null;
}

export function getAllPartColors(gender: string, mainPart: string, setIndex: number): string[] {
  gender = normalizeGender(gender);
  const data = getGenderData(gender);
  const styles = data[mainPart];
  if (!styles) return [];
  for (const style of Object.values(styles)) {
    if (style.indexNum === setIndex) {
      return style.colors;
    }
  }
  return [];
}

export function getPartNumber(setIndex: number, mainPart: string, gender: string): string {
  gender = normalizeGender(gender);
  const data = getGenderData(gender);
  const styles = data[mainPart];
  if (!styles) return '0';
  for (const [id, style] of Object.entries(styles)) {
    if (style.indexNum === setIndex) return id;
  }
  return '0';
}

export function getPartIndexByNumber(styleId: string, gender: string): [number, string] {
  gender = normalizeGender(gender);
  const data = getGenderData(gender);
  for (const partType of Object.keys(data)) {
    const styles = data[partType];
    if (styles[styleId] !== undefined) {
      return [styles[styleId].indexNum, partType];
    }
  }
  return [0, 'not found'];
}

export function getPartsAndIndexes(
  gender: string,
  mainPart: string,
  dir: string,
  setIndex: number,
  colorIndex: number
): { setIndex: number; color: string; colorIndex: number; subParts: [string, string][] } | null {
  gender = normalizeGender(gender);
  const data = getGenderData(gender);
  const counts = getGenderCounts(gender);
  const styles = data[mainPart];
  if (!styles) return null;
  const totalSets = counts[mainPart] || 0;

  if (dir === 'next') setIndex += 1;
  else if (dir === 'prev') setIndex -= 1;
  else if (dir === 'setDefault') setIndex = 0;
  else if (dir === 'randomize') setIndex = Math.floor(Math.random() * totalSets);

  if (setIndex < 0) setIndex = totalSets - 1;
  if (setIndex > totalSets - 1) setIndex = 0;

  for (const style of Object.values(styles)) {
    if (style.indexNum === setIndex) {
      const numColors = style.colors.length;
      if (dir === 'randomize') colorIndex = Math.floor(Math.random() * numColors);
      if (colorIndex > numColors - 1) colorIndex = numColors - 1;
      if (colorIndex < 0) colorIndex = 0;

      const color = style.colors[colorIndex] || 'FFFFFF';
      const subParts: [string, string][] = [];
      for (const [pType, pModel] of Object.entries(style.parts)) {
        subParts.push([pType, pModel]);
      }
      return { setIndex, color, colorIndex, subParts };
    }
  }
  return null;
}

export function getColorAndIndexes(
  gender: string,
  mainPart: string,
  dir: string,
  setIndex: number,
  colorIndex: number
): { color: string; colorIndex: number } | null {
  gender = normalizeGender(gender);
  const data = getGenderData(gender);
  const styles = data[mainPart];
  if (!styles) return null;

  const delta = dir === 'next' ? 1 : -1;

  for (const style of Object.values(styles)) {
    if (style.indexNum === setIndex) {
      const numColors = style.colors.length;
      colorIndex += delta;
      if (colorIndex < 0) colorIndex = numColors - 1;
      if (colorIndex > numColors - 1) colorIndex = 0;
      return { color: style.colors[colorIndex] || 'FFFFFF', colorIndex };
    }
  }
  return null;
}
