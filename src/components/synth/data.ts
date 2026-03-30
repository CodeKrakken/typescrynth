import { nodeAttribute } from "./types"

export const defaultSettings = {
  attributes: {
    octaves: ['4'],
    waveforms: ['sine'],
    baseFreqs: []
  },
  activeNodes: []
}

export const nodeAttrs: nodeAttribute[] = ['baseFreq', 'waveform', 'octave']    
