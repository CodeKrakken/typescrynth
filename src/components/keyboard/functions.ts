import { keys, keySize, rowOffset } from './data'
import { keyType } from './types'


export const isNote = (key: string) => {
  return keys[key].type === 'note'
}


export const randomColour = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const a = Math.floor(Math.random() * 11)/10

  return `rgba(${r}, ${g}, ${b}, ${a})`
}


export const isEven = (n: number) => { return n % 2 === 0 }

export const isHeld = (key: string, heldKeys: string[]) => {
  return heldKeys.includes(key)
}

export const keyPosition = (key: keyType) => {
  const x = key.column as number * keySize + (isEven(key.row as number) ? rowOffset : 0)
  const y = key.row as number * keySize

  return {
    transform: `translate(${x}px, ${y}px)`
  }
}