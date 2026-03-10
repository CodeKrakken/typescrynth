export type keysType = {
  [key: string]: keyType
}

export interface CustomTouchEvent extends TouchEvent {
  explicitOriginalTarget: {
    innerText: string
  }
}

export type keyType = {
  label: string
  htmlTitle?: string
  function: string | number
  type?: string
  isHeld: boolean
  oscillator?: OscillatorNode
  gain?: GainNode
}