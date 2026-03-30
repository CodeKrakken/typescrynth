import { keys } from './data'

export const isNote = (key: string) => {
  return keys[key].type === 'baseFreq'
}