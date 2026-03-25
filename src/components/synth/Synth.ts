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


const held = (keys: { [key: string]: keyType }) => {
  return Object.keys(keys).filter((key: string) => keys[key].isHeld)
}


const setGains = (waveform: string, octave: number, now: number) => {
  held(keys).forEach((key: string) => {
    const targetGain = 1/held(keys).length/settings.waveforms.length/settings.octaves.length
    const releaseTime = 0
    setGain(key, waveform, octave, now, targetGain, releaseTime)
  })
}

const setGain = (key: string, waveform: string, octave: number, now: number, targetGain: number, releaseTime: number = 0) => {
  keys[key].nodes![waveform][octave].gain.gain.cancelScheduledValues(now)
  keys[key].nodes![waveform][octave].gain.gain.setTargetAtTime(targetGain, now, releaseTime)
}

// Synth

export const synth = {

  settings: settings,
  
  startNote: (key: string) => {

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

  stopNote: (key: string) => {

    keys[key].isHeld = false
    const context = getContext()
    const now = context.currentTime

    settings.waveforms.forEach((waveform: string) => {
      settings.octaves.forEach((octave: number) => {

        const targetGain = 0
        const release = 0.05

        setGain(key, waveform, octave, now, targetGain, release)
        keys[key].nodes![waveform][octave].oscillator.stop(now + release)

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
          })
          
        }
      }
      settings.waveforms.forEach((waveform: string) => {
        settings.octaves.forEach((octave: number) => {
          setGains(waveform, octave, now)
        })
      })  
    } else {

      settings.octaves = settings.octaves.filter((oct: number) => oct !== octave)
      
      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          settings.waveforms.forEach((waveform: string) => {

            const targetGain = 0
            const releaseTime = 0.05

            setGain(key, waveform, octave, now, targetGain, releaseTime)
            keys[key].nodes![waveform][octave].oscillator.stop(now + releaseTime)
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
          })
        }
      }

      settings.octaves.forEach((octave: number) => {
        settings.waveforms.forEach((waveform: string) => {
          setGains(waveform, octave, now)
        })
      })
    } else {

      settings.waveforms = settings.waveforms.filter((wave: string) => wave !== waveform)
      
      for (let key in keys) {

        if (keys[key].isHeld && isNote(key)) {

          settings.octaves.forEach((octave: number) => {

            const targetGain = 0
            const release = 0.05

            setGain(key, waveform, octave, now, targetGain, release)
            keys[key].nodes![waveform][octave].oscillator.stop(now + 0.05)
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
