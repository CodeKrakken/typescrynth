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
  nodes?: nodeType[]
}

export type nodeType = {
  oscillator: OscillatorNode
  gain: GainNode
}