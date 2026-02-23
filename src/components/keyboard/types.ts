export type keysType = {
  [key: string]: {
    label: string
    key: string 
    htmlTitle?: string
  }[]
}

export interface keyCodesInterface {
  notes       : { [key: string]: string },
  waveShapes  : { [key: number]: string },
  octaves     : number[],
}

export interface CustomTouchEvent extends TouchEvent {
  key: string
}

export type keyType = {
  key: string 
  label: string
  htmlTitle?: string
}