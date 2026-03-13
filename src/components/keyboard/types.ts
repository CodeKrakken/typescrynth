export type keysType = {
  [key: string]: keyType
}

export interface CustomTouchEvent extends TouchEvent {
  explicitOriginalTarget: {
    innerText: string
  }
}

// Make row and column compulsory when data object finished

export type keyType = {
  htmlTitle?: string
  function: string | number
  type: string
  isHeld: boolean
  row: number
  column: number
  oscillator?: OscillatorNode
  gain?: GainNode
}