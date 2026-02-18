import { BadgeLayer, createSymbolLayer, createBaseLayer } from './BadgeLayer';
import { NUM_SYMBOL_LAYERS } from '../config';

export class BadgeModel {
  layers: BadgeLayer[] = [];

  constructor() {
    // Layers 0-3: symbols, layer 4: base
    for (let i = 0; i < NUM_SYMBOL_LAYERS; i++) {
      this.layers.push(createSymbolLayer());
    }
    this.layers.push(createBaseLayer());
  }

  getBaseLayer(): BadgeLayer {
    return this.layers[4];
  }

  /** Serialize to badge code string matching SendToServer.as format */
  serialize(): string {
    let code = '';

    // Base layer (index 4) first in the string
    const base = this.layers[4];
    if (base.visible && base.symbolNum > 0) {
      code += 'b' + padTwo(base.symbolNum) + padTwo(base.colorIndex) + 'X';
    }

    // Symbol layers (indices 0-3)
    for (let i = 0; i < NUM_SYMBOL_LAYERS; i++) {
      const layer = this.layers[i];
      if (layer.visible && layer.symbolNum > 0) {
        // Position is 0-based in the serialized string (pos - 1)
        code += 's' + padTwo(layer.symbolNum) + padTwo(layer.colorIndex) + (layer.position - 1);
      }
    }

    return code;
  }

  /** Deserialize from badge code string matching GetFromServer.as format */
  deserialize(code: string): void {
    if (!code || code.length === 0) return;

    // Reset all layers
    for (const layer of this.layers) {
      layer.symbolNum = -1;
      layer.visible = false;
      layer.colorIndex = 1;
      layer.position = 5;
    }

    let pos = 0;
    let baseSet = false;
    let symbolIdx = 0;

    while (pos < code.length) {
      const prefix = code[pos];
      if (prefix !== 'b' && prefix !== 's') break;

      const symbolNum = parseInt(code.substring(pos + 1, pos + 3), 10);
      const colorNum = parseInt(code.substring(pos + 3, pos + 5), 10);
      const posChar = code[pos + 5];

      if (prefix === 'b') {
        const layer = this.layers[4];
        layer.symbolNum = symbolNum;
        layer.colorIndex = colorNum;
        layer.visible = true;
        baseSet = true;
      } else {
        if (symbolIdx < NUM_SYMBOL_LAYERS) {
          const layer = this.layers[symbolIdx];
          layer.symbolNum = symbolNum;
          layer.colorIndex = colorNum;
          layer.position = parseInt(posChar, 10) + 1; // Convert 0-based to 1-based
          layer.visible = true;
          symbolIdx++;
        }
      }

      pos += 6;
    }
  }
}

function padTwo(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}
