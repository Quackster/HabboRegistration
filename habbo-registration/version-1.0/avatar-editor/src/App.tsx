// App.tsx — Root AvatarEditor component containing all state and logic.
//
// SolidJS component tree with createSignal for all editor state. onMount handles
// initialization (atlas loading, data loading, vectorization). JSX template renders
// all UI components with reactive props. Background color via ae-bg class from
// atlas-sprites.css (default #FFFFFF). No inline style attributes.

import { createSignal, onMount, Show, For, createEffect } from 'solid-js';
import { PART_TYPES } from './config';
import { coord } from './data/Layout';
import './data/atlas-sprites.css';
import styles from './App.module.css';
import {
  getPartAndColor,
  getPartsAndIndexes,
  getAllPartColors,
  getPartNumber,
  getPartIndexByNumber,
} from './data/FigureData';
import { loadLocalizationFromUrl } from './data/Localization';
import {
  parseFigureString,
  encodeFigureString,
  padColorIndex,
} from './model/FigureString';
import { loadAtlas, vectorizeSprites, terminateWorkerPool } from './rendering/Atlas';
import { type PartInfo } from './rendering/AvatarRenderer';
import {
  getConfig,
  sendFigure,
  sendAllowedToProceed,
  submitFormPost,
  sendSubmit,
} from './api/Bridge';
import SvgTintFilters from './ui/SvgTintFilters';
import Background from './ui/Background';
import GenderSelector from './ui/GenderSelector';
import AvatarDisplay from './ui/AvatarDisplay';
import PreviewIcon from './ui/PreviewIcon';
import PartNavigator from './ui/PartNavigator';
import ColorPalette, { type PaletteData } from './ui/ColorPalette';
import RotationControls from './ui/RotationControls';
import RandomizeButton from './ui/RandomizeButton';
import ContinueButton from './ui/ContinueButton';
import LoadingScreen from './ui/LoadingScreen';

export default function AvatarEditor() {
  const config = getConfig();

  // --- State signals ---
  const [gender, setGender] = createSignal('male');
  const [direction, setDirection] = createSignal(4);
  const [currentAction] = createSignal('std');
  const [parts, setParts] = createSignal<Map<string, PartInfo>>(new Map());
  const [partState, setPartState] = createSignal<Record<string, [number, number]>>({});
  const [loading, setLoading] = createSignal(true);
  const [palettes, setPalettes] = createSignal<Record<string, PaletteData>>({});
  const [tintColors, setTintColors] = createSignal<string[]>([]);

  // --- Helper to collect unique tint colors from current parts ---
  function updateTintColors() {
    const colorSet = new Set<string>();
    for (const info of parts().values()) {
      if (info.color && info.color.toUpperCase() !== 'FFFFFF') {
        colorSet.add(info.color.toUpperCase());
      }
    }
    setTintColors(Array.from(colorSet));
  }

  // --- Parts state management (ported from index.ts + EditorState.ts) ---

  function clearPartsForMainPart(mainPart: string): void {
    setParts(prev => {
      const next = new Map(prev);
      for (const [key, info] of next) {
        if (info.mainPart === mainPart) {
          next.delete(key);
        }
      }
      return next;
    });
  }

  function setPartEntry(partName: string, modelNum: string, color: string, mainPart: string): void {
    setParts(prev => {
      const next = new Map(prev);
      next.set(partName, { partName, modelNum, mainPart, color });
      return next;
    });
  }

  function setPartColor(mainPart: string, color: string): void {
    setParts(prev => {
      const next = new Map(prev);
      for (const [key, info] of next) {
        if (info.mainPart === mainPart) {
          next.set(key, { ...info, color });
        }
      }
      return next;
    });
  }

  function batchSetParts(updates: { clear: string; subParts: [string, string][]; color: string; mainPart: string }[]): void {
    setParts(prev => {
      const next = new Map(prev);
      for (const update of updates) {
        // Clear existing parts for this main part
        for (const [key, info] of next) {
          if (info.mainPart === update.clear) {
            next.delete(key);
          }
        }
        // Set new sub-parts
        for (const [subPartType, subModelNum] of update.subParts) {
          next.set(subPartType, {
            partName: subPartType,
            modelNum: subModelNum,
            mainPart: update.mainPart,
            color: update.color,
          });
        }
      }
      return next;
    });
  }

  // --- Logic (ported from index.ts) ---

  function getGenderCode(): string {
    return gender() === 'female' ? 'F' : 'M';
  }

  function rotateDirection(dir: 'prev' | 'next'): void {
    const delta = dir === 'next' ? -1 : 1;
    setDirection(d => ((d + delta) % 8 + 8) % 8);
  }

  function buildFigureString(): string {
    const ps = partState();
    const slices = PART_TYPES.map((partType) => {
      const state = ps[partType];
      if (!state) return { modelId: '001', colorIdx: '01' };
      const modelId = getPartNumber(state[0], partType, gender());
      const colorIdx = padColorIndex(state[1] + 1);
      return { modelId, colorIdx };
    });
    return encodeFigureString(slices);
  }

  function sendCurrentFigure(): void {
    const figStr = buildFigureString();
    sendFigure(getGenderCode(), figStr);
  }

  function setColorButtons(mainPart: string): void {
    const ps = partState();
    const state = ps[mainPart];
    if (!state) return;
    const colors = getAllPartColors(gender(), mainPart, state[0]);
    setPalettes(prev => ({
      ...prev,
      [mainPart]: { colors, selectedIndex: state[1] },
    }));
  }

  function setAllColorButtons(): void {
    for (const partType of PART_TYPES) {
      setColorButtons(partType);
    }
  }

  function setPartsFromData(mainPart: string, dir: string): void {
    const ps = partState();
    const state = ps[mainPart] || [0, 0];
    const colorIdx = mainPart !== 'hd' ? 0 : state[1];
    const result = getPartsAndIndexes(
      gender(),
      mainPart,
      dir,
      state[0],
      colorIdx,
    );
    if (!result) return;

    setPartState(prev => ({
      ...prev,
      [mainPart]: [result.setIndex, result.colorIndex],
    }));

    clearPartsForMainPart(mainPart);
    for (const [subPartType, subModelNum] of result.subParts) {
      setPartEntry(subPartType, subModelNum, result.color, mainPart);
    }

    setColorButtons(mainPart);
    sendCurrentFigure();
  }

  function setInitialLook(figure: string, genderCode: string): boolean {
    const slices = parseFigureString(figure);
    const updates: { clear: string; subParts: [string, string][]; color: string; mainPart: string }[] = [];
    const newPartState: Record<string, [number, number]> = {};

    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      const result = getPartAndColor([slice.modelId, slice.colorIdx], genderCode);
      if (!result) return false;

      const [setIndex, partType] = getPartIndexByNumber(
        slice.modelId,
        gender(),
      );
      if (partType === 'not found') return false;

      const colorIdx = parseInt(slice.colorIdx, 10) - 1;
      newPartState[partType] = [setIndex, colorIdx];

      updates.push({
        clear: result.partType,
        subParts: result.subParts,
        color: result.color,
        mainPart: result.partType,
      });
    }

    setPartState(prev => ({ ...prev, ...newPartState }));
    batchSetParts(updates);
    return true;
  }

  function randomizeAll(): void {
    const updates: { clear: string; subParts: [string, string][]; color: string; mainPart: string }[] = [];
    const newPartState: Record<string, [number, number]> = {};

    for (const partType of PART_TYPES) {
      const ps = partState();
      const state = ps[partType] || [0, 0];
      const colorIdx = partType !== 'hd' ? 0 : state[1];
      const result = getPartsAndIndexes(
        gender(),
        partType,
        'randomize',
        state[0],
        colorIdx,
      );
      if (!result) continue;

      newPartState[partType] = [result.setIndex, result.colorIndex];

      updates.push({
        clear: partType,
        subParts: result.subParts,
        color: result.color,
        mainPart: partType,
      });
    }

    setPartState(prev => ({ ...prev, ...newPartState }));
    batchSetParts(updates);
    setAllColorButtons();
    sendCurrentFigure();
  }

  function navigatePart(partType: string, dir: 'prev' | 'next'): void {
    setPartsFromData(partType, dir);
  }

  function handleGenderChange(newGender: string): void {
    setGender(newGender);
    randomizeAll();
  }

  function handleRotate(dir: 'prev' | 'next'): void {
    rotateDirection(dir);
  }

  function handleColorSelect(partType: string, color: string, index: number): void {
    setPartState(prev => ({
      ...prev,
      [partType]: [prev[partType]?.[0] ?? 0, index],
    }));
    setPartColor(partType, color);
    setPalettes(prev => ({
      ...prev,
      [partType]: { ...prev[partType], selectedIndex: index },
    }));
    sendCurrentFigure();
  }

  function handleContinue(): void {
    const figStr = buildFigureString();
    sendFigure(getGenderCode(), figStr);
    sendAllowedToProceed(true);
    sendSubmit(getGenderCode(), figStr);
    submitFormPost(getGenderCode(), figStr);
  }

  // Update tint colors whenever parts change
  createEffect(() => {
    void parts();
    updateTintColors();
  });

  // --- Initialization ---
  onMount(async () => {
    // Load atlas first — uses Vite-imported URLs by default, or assetsPath override if set
    await loadAtlas(config.assetsPath);

    // Start sprite vectorization — runs in parallel with data loading.
    // Only sprites/ entries are vectorized (avatar body parts for AvatarDisplay and PreviewIcon).
    // ui/ entries stay raster. Loading screen stays visible until BOTH data loading AND
    // vectorization complete (+ minimum loading time), so user sees only final SVG-quality sprites.
    const vectorizationDone = vectorizeSprites()
      .then(() => terminateWorkerPool())
      .catch(async (err) => {
        console.warn('SVG vectorization failed, continuing with raster sprites:', err);
        try {
          const { destroyPool } = await import('libdepixelize-wasm');
          await destroyPool();
        } catch { /* already failed */ }
      });

    // Data files embedded via ?raw imports — parsed at module scope, available immediately.
    // Only localization_url override (if configured) still fetches at runtime.
    const MIN_LOADING_MS = 3000;
    const loadingStart = Date.now();

    if (config.localizationUrl) {
      await loadLocalizationFromUrl((config.assetsPath ?? '') + config.localizationUrl);
    }

    // Set initial look
    const figure = config.figure;
    const genderCode = config.gender;
    const hasExplicitConfig = !!(config.rawFigure && config.rawGender);

    if (
      hasExplicitConfig &&
      figure.length === 25 &&
      (genderCode === 'M' || genderCode === 'F')
    ) {
      setGender(genderCode === 'M' ? 'male' : 'female');
      if (!setInitialLook(figure, genderCode)) {
        setGender(Math.random() < 0.5 ? 'male' : 'female');
        randomizeAll();
      }
    } else {
      setGender(Math.random() < 0.5 ? 'male' : 'female');
      randomizeAll();
    }

    setAllColorButtons();
    sendCurrentFigure();

    // Wait for vectorization to finish before hiding loading screen
    await vectorizationDone;

    // Enforce minimum loading time (measured from loadingStart)
    const elapsed = Date.now() - loadingStart;
    if (elapsed < MIN_LOADING_MS) {
      await new Promise(resolve => setTimeout(resolve, MIN_LOADING_MS - elapsed));
    }

    setLoading(false);
  });

  return (
    <div class={`${styles.root} ae-bg`}>
      <SvgTintFilters colors={tintColors()} />
      <Show when={!loading()} fallback={<LoadingScreen />}>
        <Background />
        <GenderSelector gender={gender()} onChange={handleGenderChange} />
        <AvatarDisplay
          parts={parts()}
          direction={direction()}
          action={currentAction()}
        />
        <For each={[...PART_TYPES]}>{(pt, i) =>
          <PreviewIcon
            partType={pt}
            parts={parts()}
            y={coord('preview_start_y') + i() * coord('preview_spacing')}
          />
        }</For>
        <PartNavigator onNavigate={navigatePart} />
        <For each={[...PART_TYPES]}>{(pt, i) =>
          <ColorPalette
            partType={pt}
            palette={palettes()[pt]}
            y={coord('color_palette_start_y') + i() * coord('color_palette_spacing')}
            onSelect={handleColorSelect}
          />
        }</For>
        <RotationControls onRotate={handleRotate} />
        <RandomizeButton onRandomize={randomizeAll} />
        <ContinueButton onContinue={handleContinue} />
      </Show>
    </div>
  );
}
