import { keys } from './data'
import { keyType } from './types'

const noteKeys = () => {
  return [keys['black keys'], keys['white keys']].flat()
}

const isOctave = (key: string) => {
  return keys.octaves.map(octave => octave.key).includes(key)
}

const isWaveform = (key: string) => {
  return keys.waveforms.map(waveform => waveform.key).includes(key)
}

export const isNote = (key: string) => {
  const notes = noteKeys().map(note => note.function && note.key)
  return notes.includes(key)
}

export const noteFrom = (key: string) => {
  return noteKeys().filter(note => note.key === key)[0].function as string
}

export const octaveFrom = (key: string) => {
  return keys.octaves.filter(octave => octave.key === key)[0].function
}

export const waveformFrom = (key: string) => {
  return keys.waveforms.filter(waveform => waveform.key === key)[0].function
}

export const functionFrom = (key: string) => {

  let keyFunction: string = ''
  
  if (isNote(key)) {
    keyFunction = 'note'
  } else if (isOctave(key)) {
    keyFunction = 'octave'
  } else if (isWaveform(key)) {
    keyFunction = 'waveform'
  }

  return keyFunction
}

export const randomColour = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const a = Math.floor(Math.random() * 11)/10

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const circleOuterClassName = (key: keyType) => {
  const suffix = key.label ? '' : ' invisible'
  return `circle-outer${suffix}`
}