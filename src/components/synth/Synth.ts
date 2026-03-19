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

      for (let octave = 0; octave <= 10; octave++) {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.connect(gain)
        gain.gain.value = 0
        gain.connect(context.destination)
        oscillator.start(0)
        keys[key].nodes!.push({
          oscillator: oscillator,
          gain: gain
        })
      }
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

    settings.octaves.forEach((octave: number) => {
    
      const now = context.currentTime
            
      keys[key].nodes![octave].oscillator.frequency.setValueAtTime(
        transpose(keys[key].function as number, octave),
        now
      )

      keys[key].nodes![octave].oscillator.type = settings.waveform as OscillatorType
      keys[key].nodes![octave].gain.gain.cancelScheduledValues(now)
      keys[key].nodes![octave].gain.gain.setTargetAtTime(1, now, 0.01)

    })
  },

  stop: (key: string) => {

    keys[key].isHeld = false

    settings.octaves.forEach((octave: number) => {

      const context = getContext()
      const now = context.currentTime

      keys[key].nodes![octave].gain.gain.cancelScheduledValues(now)
      keys[key].nodes![octave].gain.gain.setTargetAtTime(0, now, 0.01)
    })
  },
  

  toggleOctave: (octave: number) => {
    
    const context = getContext()
    const now = context.currentTime

    if (!settings.octaves.includes(octave)) {

      settings.octaves.push(octave)

      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          keys[key].nodes![octave].oscillator.type = settings.waveform as OscillatorType
        
          keys[key].nodes![octave].oscillator.frequency.setValueAtTime(
            transpose(keys[key].function as number, octave),
            now
          )

          keys[key].nodes![octave].gain.gain.cancelScheduledValues(now)
          keys[key].nodes![octave].gain.gain.setTargetAtTime(1, now, 0.01)
        }
      }
    } else {

      settings.octaves = settings.octaves.filter((oct: number) => oct !== octave)
      
      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          keys[key].nodes![octave].gain.gain.cancelScheduledValues(now)
          keys[key].nodes![octave].gain.gain.setTargetAtTime(0, now, 0.01)
        }
      }
    }
  },

  changeWaveform: (waveform: string) => {
    settings.waveform = waveform

    for (let key in keys) {

      if (keys[key].isHeld && isNote(key)) {

        settings.octaves.forEach((octave: number) => {

          keys[key].nodes![octave].oscillator.type = settings.waveform as OscillatorType
        })
      }
    }
  },

  resume: () => {

    const context = getContext()
    context.resume()
  }

}
