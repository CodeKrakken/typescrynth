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



const transpose = (frequency: number, octave: number) => {

  for ( let i = 0 ; i < octave; i++ ) {
    frequency *= 2
  }

  return +frequency.toFixed(2)
}

const initialise = (keys: { [key: string]: keyType }) => {

  for(let key in keys) {
    if (keys[key].type === 'note') {
      const context = getContext()
      // keys[key].oscillator = context.createOscillator()
      keys[key].gain = context.createGain()
      // keys[key].oscillator!.connect(keys[key].gain as GainNode)
      keys[key].gain!.connect(context.destination)
      keys[key].gain!.gain.value = 0
      // keys[key].oscillator!.start(0)
    }

  }
}

initialise(keys)



// Synth

export const synth = {

  settings: settings,
  
  play: (key: string) => {

    keys[key].isHeld = true
    const context = getContext()

    synth.settings.octaves.forEach((octave: number) => {
      const now = context.currentTime

      const oscillator = context.createOscillator()
      oscillator.connect(keys[key].gain as GainNode)
      oscillator.start(0)
      oscillator.frequency.setValueAtTime(
        transpose(keys[key].function as number, octave),
        now
      )

      oscillator.type = settings.waveform as OscillatorType

      keys[key].gain!.gain.cancelScheduledValues(now)
      keys[key].gain!.gain.setTargetAtTime(1, now, 0.01)
    })
  },

  stop: (key: string) => {

    keys[key].isHeld = false

    const context = getContext()
    const now = context.currentTime

    keys[key].gain!.gain.cancelScheduledValues(now)
    keys[key].gain!.gain.setTargetAtTime(0, now, 0.01)
  },
  

  toggleOctave: (octave: number) => {

    if (!settings.octaves.includes(octave)) {
      settings.octaves.push(octave)
      console.log(settings)
      console.log(octave)

      const context = getContext()
      const now = context.currentTime

      for (let key in keys) {
        
        synth.settings.octaves.forEach((octave: number) => {

          if (keys[key].isHeld && isNote(key)) {

            const oscillator = context.createOscillator()
            oscillator!.connect(keys[key].gain as GainNode)
            oscillator!.start(0)
            oscillator!.frequency.setValueAtTime(
              transpose(keys[key].function as number, octave),
              now
            )
          }
        })
      } 
    } else {
      settings.octaves = settings.octaves.filter((oct: number) => oct !== octave)
      console.log(settings)
      console.log(octave)
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
