export type keysType = {
  [key: string]: keyType
}

export interface CustomTouchEvent extends TouchEvent {
  explicitOriginalTarget: {
    innerText: string
  }
}

// Make row and col compulsory when data object finished

export type keyType = {
  label: string
  htmlTitle?: string
  function: string | number
  type: string
  isHeld: boolean
  row?: number
  col?: number
  oscillator?: OscillatorNode
  gain?: GainNode
}