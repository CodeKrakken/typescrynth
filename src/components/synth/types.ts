export type node = {
  oscillator: OscillatorNode,
  waveform: string,
  gain: GainNode,
  octave: string,
  baseFreq: string
}

export type synthSettings = {
  attributes: {
    octaves: string[]
    waveforms: string[]
    baseFreqs: string[]
  }
  activeNodes: node[]
}

export type nodeAttribute = 'octave' | 'waveform' | 'baseFreq'

export type settingsAttribute = 'octaves' | 'waveforms' | 'baseFreqs'