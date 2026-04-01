import { keysType, keyType } from '../types'
import { synthType } from '../synth/types'

// helper functions

const position = (key: keyType, keySize: number, rowOffset: number) => {

  const x = key.column as number * keySize + (isEven(key.row as number) ? rowOffset : 0)
  const y = key.row as number * keySize

  return {
    transform: `translate(${x}px, ${y}px)`
  }
}


const isEven = (n: number) => { return n % 2 === 0 }


// exported functions

export const generateKeyColours = (

  synth: synthType,
  keys: keysType

) => {

  synth.settings.attributes.octaves.forEach(octave => {
    keys[octave].colour = randomColour()
  })

  synth.settings.attributes.waveforms.forEach(waveform => {
    const key = Object.keys(keys).find(key => keys[key].function === waveform) as string
    keys[key].colour = randomColour()
  })
}


export const keyStyle = (

  keySize: number, 
  rowOffset: number, 
  keys: keysType, 
  keyName: string

) => {

  return {
    ...position(keys[keyName], keySize, rowOffset), 
    background: keys[keyName].colour
  }
}


export const randomColour = () => {

  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  return `rgba(${r}, ${g}, ${b})`
}