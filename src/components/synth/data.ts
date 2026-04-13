import { AudioContextMockType, nodeAttribute } from "./types"

export const defaultSettings = {
  attributes: {
    octaves: ['4'],
    waveforms: ['sine'],
    baseFreqs: []
  },
  activeNodes: []
}

export const nodeAttrs: nodeAttribute[] = ['baseFreq', 'waveform', 'octave']    

export const AudioContextMock: AudioContextMockType = {
  createOscillator: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn(),
    frequency: {
      setValueAtTime: jest.fn()
    }
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      cancelScheduledValues: jest.fn(),
      setTargetAtTime: jest.fn()
    }
  })),
  resume: jest.fn(),
  state: 'running'
};