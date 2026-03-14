import {synthSettings} from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { isNote } from '../functions'
import { keyType } from '../types'

const settings: synthSettings = defaultSettings

let context: AudioContext | null = null

// Helper functions

const getContext = () => {
  
  if (!context) {
    context = new AudioContext()
  }

  if (context.state === 'suspended') {
    context.resume()
  }

  return context
}



const transpose = (frequency: number) => {

  for ( let i = 0 ; i < settings.octave; i++ ) {
    frequency *= 2
  }

  return +frequency.toFixed(2)
}

const initialise = (keys: { [key: string]: keyType }) => {

  for(let key in keys) {
    if (keys[key].type === 'note') {
      const context = getContext()
      keys[key].oscillator = context.createOscillator()
      keys[key].gain = context.createGain()
      keys[key].oscillator!.connect(keys[key].gain as GainNode)
      keys[key].gain!.connect(context.destination)
      keys[key].gain!.gain.value = 0
      keys[key].oscillator!.start(0)
    }

  }
}

initialise(keys)



// Synth

export const synth = {
  
  play: (key: string) => {

    keys[key].isHeld = true
    const context = getContext()

    keys[key].oscillator!.type = settings.waveform as OscillatorType
    keys[key].oscillator!.frequency.value = transpose(keys[key].function as number)
    const now = context.currentTime

    keys[key].gain!.gain.cancelScheduledValues(now)
    keys[key].gain!.gain.setTargetAtTime(1, now, 0.01)
  },

  stop: (key: string) => {

    keys[key].isHeld = false

    const context = getContext()
    const now = context.currentTime

    keys[key].gain!.gain.cancelScheduledValues(now)
    keys[key].gain!.gain.setTargetAtTime(0, now, 0.01)
  },
  

  changeOctave: (octave: number) => {
    settings.octave = octave

    const context = getContext()
    const now = context.currentTime

    for (let key in keys) {
      if (keys[key].isHeld && isNote(key)) {
        keys[key].oscillator!.frequency.setValueAtTime(
          transpose(keys[key].function as number),
          now
        )
      }
    }
  },

  changeWaveform: (waveform: string) => {
    settings.waveform = waveform

    for (let key in keys) {
      if (keys[key].isHeld && isNote(key)) {
        keys[key].oscillator!.type = settings.waveform as OscillatorType
      }
    }
  },

  resume: () => {

    const context = getContext()
    context.resume()
  }

}
