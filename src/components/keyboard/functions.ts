import { keySize, rowOffset } from './data'
import { keyType } from '../types'


export const randomColour = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  return `rgba(${r}, ${g}, ${b})`
}


export const isEven = (n: number) => { return n % 2 === 0 }


export const position = (key: keyType) => {
  const x = key.column as number * keySize + (isEven(key.row as number) ? rowOffset : 0)
  const y = key.row as number * keySize

  return {
    transform: `translate(${x}px, ${y}px)`
  }
}
