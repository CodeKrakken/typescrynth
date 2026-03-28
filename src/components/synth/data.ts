import { nodeAttribute } from "./types"

export const defaultSettings = {
  attributes: {
    octaves: ['4'],
    waveforms: ['sine'],
    keys: []
  },
  activeNodes: []
}

export const nodeAttrs: nodeAttribute[] = ['key', 'waveform', 'octave']    
