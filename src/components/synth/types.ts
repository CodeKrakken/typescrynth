export type node = {
  oscillator: OscillatorNode,
  waveform: string,
  gain: GainNode,
  octave: string,
  key: string
}

export type synthSettings = {
  octaves: string[]
  waveforms: string[]
  keys: string[]
  activeNodes: node[]
}

export type nodeAttribute = 'octave' | 'waveform' | 'key'

export type settingsAttribute = 'octaves' | 'waveforms' | 'keys'