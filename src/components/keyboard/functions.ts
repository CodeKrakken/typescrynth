import { keys } from './data'
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

export const circleOuterClassName = (key: keyType) => {
  const suffix = key.label ? '' : ' invisible'
  return `circle-outer${suffix}`
}