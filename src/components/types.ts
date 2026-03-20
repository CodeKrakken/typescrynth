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
  nodes?: { [key: string]: nodeType[] }
}

export type nodeType = {
  oscillator: OscillatorNode
  gain: GainNode
}