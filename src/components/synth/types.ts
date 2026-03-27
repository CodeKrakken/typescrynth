export type node = {
  oscillator: OscillatorNode,
  waveform: string,
  gain: GainNode,
  octave: number,
  key: string
}

export type synthSettings = {
  octaves: number[]
  waveforms: string[]
  keys: string[]
  activeNodes: node[]
}
