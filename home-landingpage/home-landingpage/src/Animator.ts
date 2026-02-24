import {
  BG_COLOR,
  SWF_FPS,
  LOOP_START,
  LOOP_END,
  FRAME_INNER_X,
  FRAME_INNER_Y,
  FRAME_INNER_W,
  FRAME_INNER_H,
  ATLAS_FRAME_W,
  ATLAS_FRAME_H,
  ATLAS_COUNT,
} from './config';
import { AtlasLoader } from './AtlasLoader';
import { LoadingScreen } from './LoadingScreen';

export class Animator {
  private ctx: CanvasRenderingContext2D;
  private loader: AtlasLoader;
  private loading: LoadingScreen;
  private overlayCanvas: HTMLCanvasElement;

  private currentFrame = LOOP_START;
  private lastFrameTime = 0;
  private readonly frameInterval = 1000 / SWF_FPS;

  private phase: 'loading' | 'playing' = 'loading';
  private rafId = 0;

  private recordingCanvas: HTMLCanvasElement | null = null;
  private recordingCtx: CanvasRenderingContext2D | null = null;
  private recorder: MediaRecorder | null = null;
  private recordChunks: BlobPart[] = [];
  private pendingRecord = false;

  constructor(
    private canvas: HTMLCanvasElement,
    assetsPath: string,
    overlayCanvas: HTMLCanvasElement,
  ) {
    this.ctx = canvas.getContext('2d', { desynchronized: true })!;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = BG_COLOR;
    this.overlayCanvas = overlayCanvas;

    const base = assetsPath.replace(/\/?$/, '/');
    const atlasBase = `${base}atlases/`;
    this.loader = new AtlasLoader(atlasBase);
    this.loading = new LoadingScreen(assetsPath);

    const overlayCtx = overlayCanvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => { overlayCtx.drawImage(img, 0, 0); };
    img.src = `${base}images/2.webp`;
  }

  start(): void {
    this.loader.load(0);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  stop(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    cancelAnimationFrame(this.rafId);
    this.loader.dispose();
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    } else {
      this.lastFrameTime = 0;
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }
  };

  private tick(time: number): void {
    if (this.phase === 'loading') {
      const progress = this.loader.loadedCount / 1;
      this.loading.draw(this.ctx, time, progress);
      if (this.loading.isDone(time, progress)) {
        this.phase = 'playing';
        this.loader.preload(1, ATLAS_COUNT - 1);
      }
    } else if (time - this.lastFrameTime >= this.frameInterval) {
      this.renderFrame();
      this.advance();
      this.lastFrameTime += this.frameInterval;
      // Recovery cap: don't accumulate backlog after a pause
      if (time - this.lastFrameTime >= this.frameInterval) this.lastFrameTime = time;
    }

    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  startRecording(): void {
    if (this.recorder || this.pendingRecord) return;
    this.pendingRecord = true;
    console.log('[HomeLandingpage] Recording queued, will start at next loop start…');
  }

  private beginRecording(): void {
    this.pendingRecord = false;
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9' : 'video/webm';

    this.recordingCanvas = document.createElement('canvas');
    this.recordingCanvas.width = this.canvas.width;
    this.recordingCanvas.height = this.canvas.height;
    this.recordingCtx = this.recordingCanvas.getContext('2d')!;
    this.recordingCtx.imageSmoothingEnabled = false;
    this.recordingCtx.fillStyle = BG_COLOR;

    const stream = this.recordingCanvas.captureStream(SWF_FPS);
    this.recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
    this.recordChunks = [];
    this.recorder.ondataavailable = e => { if (e.data.size > 0) this.recordChunks.push(e.data); };
    this.recorder.onstop = () => this.saveRecording();
    this.recorder.start();
    console.log('[HomeLandingpage] Recording started.');
  }

  private saveRecording(): void {
    const blob = new Blob(this.recordChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'home-landingpage.webm';
    a.click();
    URL.revokeObjectURL(url);
    this.recorder = null;
    this.recordingCtx = null;
    this.recordingCanvas = null;
    this.recordChunks = [];
  }

  private renderFrame(): void {
    // Start recording at the beginning of a loop so the full cycle is captured.
    if (this.pendingRecord && this.currentFrame === LOOP_START) {
      this.beginRecording();
    }

    const entry = this.loader.get(this.currentFrame);
    if (!entry) return;

    this.ctx.fillRect(FRAME_INNER_X, FRAME_INNER_Y, FRAME_INNER_W, FRAME_INNER_H);
    this.ctx.drawImage(entry.img, entry.sx, entry.sy, ATLAS_FRAME_W, ATLAS_FRAME_H,
                            FRAME_INNER_X, FRAME_INNER_Y, FRAME_INNER_W, FRAME_INNER_H);

    if (this.recordingCtx) {
      // Draw directly (not via drawImage(canvas)) to avoid desynchronized-canvas read glitches.
      this.recordingCtx.fillRect(FRAME_INNER_X, FRAME_INNER_Y, FRAME_INNER_W, FRAME_INNER_H);
      this.recordingCtx.drawImage(entry.img, entry.sx, entry.sy, ATLAS_FRAME_W, ATLAS_FRAME_H,
                                  FRAME_INNER_X, FRAME_INNER_Y, FRAME_INNER_W, FRAME_INNER_H);
      this.recordingCtx.drawImage(this.overlayCanvas, 0, 0);
    }
  }

  private advance(): void {
    if (this.recorder && this.recorder.state === 'recording' && this.currentFrame === LOOP_END) {
      this.recorder.stop();
    }
    this.currentFrame++;
    if (this.currentFrame > LOOP_END) {
      this.currentFrame = LOOP_START;
    }
  }
}
