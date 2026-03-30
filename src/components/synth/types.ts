export type node = {
  oscillator: OscillatorNode,
  waveform: string,
  gain: GainNode,
  octave: string,
  noteKey: string
}

export type synthSettings = {
  attributes: {
    octaves: string[]
    waveforms: string[]
    noteKeys: string[]
  }
  activeNodes: node[]
}

export type nodeAttribute = 'octave' | 'waveform' | 'noteKey'

export type settingsAttribute = 'octaves' | 'waveforms' | 'noteKeys'