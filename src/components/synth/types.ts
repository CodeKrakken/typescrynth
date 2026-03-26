export type node = {
  oscillator: OscillatorNode,
  gain: GainNode,
  octave: number,
  key: string
}

export type synthSettings = {
  selectedOctaves: number[]
  selectedWaveforms: string[]
  heldKeys: string[]
  activeNodes: node[]
}
