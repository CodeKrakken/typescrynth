export type keysType = {
  [key: string]: {
    label: string
    key: string 
    htmlTitle?: string
    function?: string | number
  }[]
}

export interface CustomTouchEvent extends TouchEvent {
  explicitOriginalTarget: {
    innerText: string
  }
}

export type keyType = {
  key: string 
  label: string
  htmlTitle?: string
}