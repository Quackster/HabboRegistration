import {
  PART_TYPES,
  PREVIEW_X,
  PREVIEW_START_Y,
  PREVIEW_SPACING,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  setTextColor,
} from "./config";
import { loadSymbolMap } from "./data/SymbolMap";
import {
  loadFigureData,
  getPartAndColor,
  getPartsAndIndexes,
  getAllPartColors,
  getPartNumber,
  getPartIndexByNumber,
} from "./data/FigureData";
import { loadLocalization } from "./data/Localization";
import {
  parseFigureString,
  encodeFigureString,
  padColorIndex,
} from "./model/FigureString";
import * as state from "./model/EditorState";
import { loadAtlas } from "./rendering/Atlas";
import * as renderer from "./rendering/AvatarRenderer";
import { renderPreviewIcon } from "./rendering/PreviewIconRenderer";
import {
  createCanvas,
  getCtx,
  setRenderCallback,
  onRedraw,
  startAnimationFramesGarbageCollector
} from "./ui/CanvasManager";
import { drawBackground } from "./ui/BackgroundPanel";
import { setupGenderSelector, drawGenderSelector } from "./ui/GenderSelector";
import { drawAvatar, startAnimation, stopAnimation } from "./ui/AvatarDisplay";
import {
  setupRotationControls,
  drawRotationControls,
} from "./ui/RotationControls";
import { setupPartNavigator, drawPartNavigator } from "./ui/PartNavigator";
import {
  setupColorPalette,
  setupColorPaletteLeftArrow,
  setupColorPaletteRightArrow,
  setColors,
  drawColorPalettes,
} from "./ui/ColorPalette";
import {
  setupRandomizeButton,
  drawRandomizeButton,
} from "./ui/RandomizeButton";
import { setupContinueButton, setupContinueButtonActivate, drawContinueButton } from "./ui/ContinueButton";
import {
  buildLoadingFrames,
  startLoadingAnimation,
  stopLoadingAnimation,
} from "./ui/LoadingScreen";
import {
  getConfig,
  sendFigure,
  sendAllowedToProceed,
  submitFormPost,
  sendSubmit,
} from "./api/Bridge";

async function init() {
  const config = getConfig();
  const assetsPath = config.assetsPath;

  // Phase 1: Create canvas and show loading screen immediately
  const container = document.getElementById(config.container);
  if (!container) {
    console.error(`No #${config.container} element found`);
    return;
  }
  container.style.width = CANVAS_WIDTH + "px";
  container.style.height = CANVAS_HEIGHT + "px";
  if (config.backgroundColor) {
    container.style.backgroundColor = config.backgroundColor;
  }
  if (config.textColor) {
    setTextColor(config.textColor);
  }
  createCanvas(container);

  // Load atlas first (single image + manifest for all assets)
  await loadAtlas(assetsPath);
  buildLoadingFrames();
  startLoadingAnimation(getCtx());

  // Phase 2: Load data files while loading screen plays
  const MIN_LOADING_MS = 3000;
  const loadingStart = Date.now();

  await Promise.all([
    loadSymbolMap(assetsPath),
    loadFigureData(assetsPath + "data/figuredata.csv"),
    loadLocalization(assetsPath + config.localizationUrl),
  ]);

  const elapsed = Date.now() - loadingStart;
  if (elapsed < MIN_LOADING_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_LOADING_MS - elapsed),
    );
  }

  stopLoadingAnimation();

  // Phase 3: Set initial look
  let figure = config.figure;
  let genderCode = config.gender;
  const hasExplicitConfig = !!(config.rawFigure && config.rawGender);

  if (
    hasExplicitConfig &&
    figure.length === 25 &&
    (genderCode === "M" || genderCode === "F")
  ) {
    state.setGender(genderCode === "M" ? "male" : "female");
    if (!setInitialLook(figure, genderCode)) {
      // Provided config was invalid, randomize instead
      state.setGender(Math.random() < 0.5 ? "male" : "female");
      randomizeAll();
    }
  } else {
    // No config provided — start with a random look and gender
    state.setGender(Math.random() < 0.5 ? "male" : "female");
    randomizeAll();
  }

  // Phase 4: Setup UI interactions
  setupGenderSelector((gender) => {
    state.setGender(gender);
    randomizeAll();
  });

  setupRotationControls((dir) => {
    state.rotateDirection(dir);
    renderer.preloadCurrentSprites(state.direction, state.currentAction);
    requestRedrawAll();
  });

  setupPartNavigator((partType, dir) => {
    navigatePart(partType, dir);
  });

  setupColorPalette((partType, color, index) => {
    state.partState[partType][1] = index;
    renderer.setPartColor(partType, color);
    sendCurrentFigure();
    requestRedrawAll();
  });

  setupColorPaletteLeftArrow(() => {
    requestRedrawAll();
  });

  setupColorPaletteRightArrow(() => {
    requestRedrawAll();
  });

  setupRandomizeButton(() => {
    randomizeAll();
  });

  setupContinueButton(() => {
    const figStr = buildFigureString();
    sendFigure(state.getGenderCode(), figStr);
    sendAllowedToProceed(true);
    sendSubmit(state.getGenderCode(), figStr);
    submitFormPost(state.getGenderCode(), figStr);
  });

  setupContinueButtonActivate(() => {
    requestRedrawAll();
  });

  // Set initial color palettes
  setAllColorButtons();

  // Phase 5: Preload sprites and start render loop
  await renderer.preloadCurrentSprites(state.direction, state.currentAction);

  setRenderCallback(() => {
    const ctx = getCtx();
    drawBackground(ctx);
    drawGenderSelector(ctx);
    drawAvatar(ctx);
    drawPreviewIcons(ctx);
    drawPartNavigator(ctx);
    drawColorPalettes(ctx);
    drawRotationControls(ctx);
    drawRandomizeButton(ctx);
    drawContinueButton(ctx);
  });

  // Hook CanvasManager to EventBus
  state.events.on('redraw', onRedraw);

  // Phase 6: First draw of all the UI stuff
  requestRedrawAll();

  startAnimationFramesGarbageCollector();

  // Send initial figure to parent
  sendCurrentFigure();
}

function requestRedrawAll(): void {
  state.events.emit('redraw');
}

function setInitialLook(figure: string, genderCode: string): boolean {
  const slices = parseFigureString(figure);

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    const result = getPartAndColor([slice.modelId, slice.colorIdx], genderCode);
    if (!result) return false;

    const [setIndex, partType] = getPartIndexByNumber(
      slice.modelId,
      state.chosenGender,
    );
    if (partType === "not found") return false;

    const colorIdx = parseInt(slice.colorIdx, 10) - 1;
    state.partState[partType] = [setIndex, colorIdx];

    // Set renderer parts
    renderer.clearPartsForMainPart(result.partType);
    for (const [subPartType, subModelNum] of result.subParts) {
      renderer.setPart(subPartType, subModelNum, result.color, result.partType);
    }
  }

  return true;
}

function setPartsFromData(mainPart: string, dir: string): void {
  const ps = state.partState[mainPart] || [0, 0];
  const colorIdx = mainPart !== "hd" ? 0 : ps[1];
  const result = getPartsAndIndexes(
    state.chosenGender,
    mainPart,
    dir,
    ps[0],
    colorIdx,
  );
  if (!result) return;

  state.partState[mainPart] = [result.setIndex, result.colorIndex];

  renderer.clearPartsForMainPart(mainPart);
  for (const [subPartType, subModelNum] of result.subParts) {
    renderer.setPart(subPartType, subModelNum, result.color, mainPart);
  }

  setColorButtons(mainPart);
  sendCurrentFigure();
}

function navigatePart(partType: string, dir: "prev" | "next"): void {
  setPartsFromData(partType, dir);
  renderer.preloadCurrentSprites(state.direction, state.currentAction);
  requestRedrawAll();
}

function randomizeAll(): void {
  for (const partType of PART_TYPES) {
    setPartsFromData(partType, "randomize");
  }
  setAllColorButtons();
  renderer.preloadCurrentSprites(state.direction, state.currentAction);
  sendCurrentFigure();
  requestRedrawAll();
}

function setAllColorButtons(): void {
  for (const partType of PART_TYPES) {
    setColorButtons(partType);
  }
}

function setColorButtons(mainPart: string): void {
  const ps = state.partState[mainPart];
  if (!ps) return;
  const colors = getAllPartColors(state.chosenGender, mainPart, ps[0]);
  setColors(mainPart, colors, ps[1]);
}

function buildFigureString(): string {
  const slices = PART_TYPES.map((partType) => {
    const ps = state.partState[partType];
    if (!ps) return { modelId: "001", colorIdx: "01" };
    const modelId = getPartNumber(ps[0], partType, state.chosenGender);
    const colorIdx = padColorIndex(ps[1] + 1);
    return { modelId, colorIdx };
  });
  return encodeFigureString(slices);
}

function sendCurrentFigure(): void {
  const figStr = buildFigureString();
  sendFigure(state.getGenderCode(), figStr);
}

function drawPreviewIcons(ctx: CanvasRenderingContext2D): void {
  const parts = renderer.getParts();

  for (let i = 0; i < PART_TYPES.length; i++) {
    const y = PREVIEW_START_Y + i * PREVIEW_SPACING;
    renderPreviewIcon(ctx, PREVIEW_X, y, PART_TYPES[i], parts);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
