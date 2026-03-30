import { nodeAttribute } from "./types"

export const defaultSettings = {
  attributes: {
    octaves: ['4'],
    waveforms: ['sine'],
    noteKeys: []
  },
  activeNodes: []
}

export const nodeAttrs: nodeAttribute[] = ['noteKey', 'waveform', 'octave']    
