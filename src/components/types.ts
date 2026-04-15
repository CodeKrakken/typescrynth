export type keysType = {
  [key: string]: keyType
}

export type keyType = {
  htmlTitle: string
  function: string | number
  type: string
  isHeld: boolean
  row: number
  column: number
  colour: string
  nodes?: { 
    [key: string]: {
      [key:number]: nodeType 
    }
  }
  touchTitle?: string
}

export type nodeType = {
  oscillator: OscillatorNode
  gain: GainNode
}


export type synthType = {
  settings: synthSettings
}


export type synthSettings = {
  attributes: {
    octaves: string[]
    waveforms: string[]
    baseFreqs: string[]
  }
  activeNodes: node[]
}


export type node = {
  oscillator: OscillatorNode,
  waveform: string,
  gain: GainNode,
  octave: string,
  baseFreq: string
}


export type nodeAttribute = 'octave' | 'waveform' | 'baseFreq'

export type settingsAttribute = 'octaves' | 'waveforms' | 'baseFreqs'