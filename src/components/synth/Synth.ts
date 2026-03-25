import {synthSettings} from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { isNote } from '../functions'
import { keyType } from '../types'
import { Context } from 'vm'

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

// const initialise = (keys: { [key: string]: keyType }) => {

//   const waveforms = ['sine', 'triangle', 'sawtooth', 'square']
  
//   for(let key in keys) {
//     if (keys[key].type === 'note') {
//       const context = getContext()

//       waveforms.forEach((waveform: string) => {

//         for (let octave = 0; octave <= 10; octave++) {
          
//           const oscillator = context.createOscillator()
//           const gain = context.createGain()
//           const now = context.currentTime
//           oscillator.connect(gain)
//           oscillator.type = waveform as OscillatorType
//           oscillator.frequency.setValueAtTime(
//             transpose(keys[key].function as number, octave),
//             now
//           )
//           gain.gain.value = 0
//           gain.connect(context.destination)
//           oscillator.start(0)
//           keys[key].nodes![waveform as string].push({
//             oscillator: oscillator,
//             gain: gain
//           })
//         }
//       })
//     }
//   }
// }

// initialise(keys)


const held = (keys: { [key: string]: keyType }) => {
  return Object.keys(keys).filter((key: string) => keys[key].isHeld)
}

const setGains = (waveform: string, octave: number, now: number) => {
  held(keys).forEach((key: string) => {
    const gain = 1/held(keys).length/settings.waveforms.length/settings.octaves.length
    keys[key].nodes![waveform][octave].gain.gain.cancelScheduledValues(now)
    keys[key].nodes![waveform][octave].gain.gain.setTargetAtTime(gain, now, 0.01)
  })
}

// Synth

export const synth = {

  settings: settings,
  
  play: (key: string) => {

    keys[key].isHeld = true
    const context = getContext()
    const now = context.currentTime

    settings.waveforms.forEach((waveform: string) => {
      settings.octaves.forEach((octave: number) => {

        keys[key].nodes![waveform as string][octave] = synth.newNode(key, context, now, waveform, octave)
        setGains(waveform, octave, now)
      })
    })
  },

  stop: (key: string) => {

    keys[key].isHeld = false
    const context = getContext()
    const now = context.currentTime

    settings.waveforms.forEach((waveform: string) => {
      settings.octaves.forEach((octave: number) => {

        keys[key].nodes![waveform][octave].gain.gain.cancelScheduledValues(now)
        keys[key].nodes![waveform][octave].gain.gain.setTargetAtTime(0, now, 0.01)

        setGains(waveform, octave, now)
      })
    })
  },

  newNode: (
    key: string, 
    context: Context, 
    now: number, 
    waveform: string, 
    octave: number
  ) => {

    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.connect(gain)
    oscillator.type = waveform as OscillatorType
    oscillator.frequency.setValueAtTime(
      transpose(keys[key].function as number, octave),
      now
    )
    gain.connect(context.destination)
    oscillator.start(0)

    return {
      oscillator: oscillator,
      gain: gain
    }
  },
  

  toggleOctave: (octave: number) => {
    
    const context = getContext()
    const now = context.currentTime

    if (!settings.octaves.includes(octave)) {

      settings.octaves.push(octave)

      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          settings.waveforms.forEach((waveform: string) => {

            keys[key].nodes![waveform as string][octave] = synth.newNode(key, context, now, waveform, octave)
            settings.octaves.forEach((octave: number) => {

              setGains(waveform, octave, now)
            })
          })
        }
      }
    } else {

      settings.octaves = settings.octaves.filter((oct: number) => oct !== octave)
      
      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          settings.waveforms.forEach((waveform: string) => {
            keys[key].nodes![waveform][octave].gain.gain.cancelScheduledValues(now)
            keys[key].nodes![waveform][octave].gain.gain.setTargetAtTime(0, now, 0.01)
          })
        }
      }
      settings.waveforms.forEach((waveform: string) => {
        settings.octaves.forEach((octave: number) => {
          setGains(waveform, octave, now)
        })
      })
    }
  },

  toggleWaveform: (waveform: string) => {
    
    const context = getContext()
    const now = context.currentTime

    if (!settings.waveforms.includes(waveform)) {

      settings.waveforms.push(waveform)

      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          settings.octaves.forEach((octave: number) => {
            keys[key].nodes![waveform as string][octave] = synth.newNode(key, context, now, waveform, octave)
            settings.waveforms.forEach((waveform: string) => {
              setGains(waveform, octave, now)
            })
          })
        }
      }
    } else {

      settings.waveforms = settings.waveforms.filter((wave: string) => wave !== waveform)
      
      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          settings.octaves.forEach((octave: number) => {
            keys[key].nodes![waveform][octave].gain.gain.cancelScheduledValues(now)
            keys[key].nodes![waveform][octave].gain.gain.setTargetAtTime(0, now, 0.01)
          })
        }
      }
      settings.waveforms.forEach((waveform: string) => {
        settings.octaves.forEach((octave: number) => {
          setGains(waveform, octave, now)
        })
      })
    }
  },

  resume: () => {

    const context = getContext()
    context.resume()
  }
}
