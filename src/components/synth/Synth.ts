import { synthSettings } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { Context } from 'vm'

const settings: synthSettings = defaultSettings
let context: AudioContext | null = null


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


const setGains = (waveform: string, octave: number, now: number) => {

  settings.heldKeys.forEach((key: string) => {

    const targetGain = 1/settings.heldKeys.length/settings.waveforms.length/settings.octaves.length
    const releaseTime = 0

    setGain(key, waveform, octave, now, targetGain, releaseTime)
  })
}


const setGain = (
  key: string, 
  waveform: string, 
  octave: number, 
  now: number, 
  targetGain: number, 
  releaseTime: number = 0
) => {
  keys[key].nodes![waveform][octave].gain.gain.cancelScheduledValues(now)
  keys[key].nodes![waveform][octave].gain.gain.setTargetAtTime(targetGain, now, releaseTime)
}


const newNode = (
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
}


export const synth = {

  settings: settings,
  
  startNote: (key: string) => {

    settings.heldKeys.push(key)
    const context = getContext()
    const now = context.currentTime

    settings.waveforms.forEach((waveform: string) => {
      settings.octaves.forEach((octave: number) => {

        keys[key].nodes![waveform as string][octave] = newNode(key, context, now, waveform, octave)
        setGains(waveform, octave, now)
      })
    })
  },


  stopNote: (key: string) => {

    settings.heldKeys = settings.heldKeys.filter((heldKey: string) => heldKey !== key)
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
  

  toggleOctave: (octave: number) => {
    
    const context = getContext()
    const now = context.currentTime

    if (!settings.octaves.includes(octave)) {
      settings.octaves.push(octave)

      settings.heldKeys.forEach((key: string) => {
        settings.waveforms.forEach((waveform: string) => {

          keys[key].nodes![waveform as string][octave] = newNode(key, context, now, waveform, octave)
        })
      })
      
      settings.waveforms.forEach((waveform: string) => {
        settings.octaves.forEach((octave: number) => {

          setGains(waveform, octave, now)
        })
      })  
    } else {
      settings.octaves = settings.octaves.filter((oct: number) => oct !== octave)
      
      settings.heldKeys.forEach((key: string) => {
        settings.waveforms.forEach((waveform: string) => {

          const targetGain = 0
          const releaseTime = 0.05

          setGain(key, waveform, octave, now, targetGain, releaseTime)
          keys[key].nodes![waveform][octave].oscillator.stop(now + releaseTime)
        })
      })

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

      settings.heldKeys.forEach((key: string) => {

        settings.octaves.forEach((octave: number) => {
          keys[key].nodes![waveform as string][octave] = newNode(key, context, now, waveform, octave)
        })
      })

      settings.octaves.forEach((octave: number) => {
        settings.waveforms.forEach((waveform: string) => {
          setGains(waveform, octave, now)
        })
      })
    } else {

      settings.waveforms = settings.waveforms.filter((wave: string) => wave !== waveform)
      
      settings.heldKeys.forEach((key: string) => {
        settings.octaves.forEach((octave: number) => {

          const targetGain = 0
          const release = 0.05

          setGain(key, waveform, octave, now, targetGain, release)
          keys[key].nodes![waveform][octave].oscillator.stop(now + 0.05)
        })
      })

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
