import { synthSettings } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { Context } from 'vm'
import { getFrequency } from './functions'

let context: AudioContext
let { heldKeys, selectedOctaves, selectedWaveforms }: synthSettings = defaultSettings

const getContext = () => {
  
  if (!context) {
    context = new AudioContext()
  }

  if (context.state === 'suspended') {
    context.resume()
  }
  return context
}

context = getContext()


const setGains = (waveform: string, octave: number, now: number) => {

  heldKeys.forEach((key: string) => {

    const targetGain = 1/heldKeys.length/selectedWaveforms.length/selectedOctaves.length
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
    getFrequency(keys[key].function as number, octave),
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

  selectedOctaves: selectedOctaves,
  selectedWaveforms: selectedWaveforms,
  
  startNote: (key: string) => {

    heldKeys.push(key)
    const now = context.currentTime

    selectedWaveforms.forEach((waveform: string) => {
      selectedOctaves.forEach((octave: number) => {

        keys[key].nodes![waveform as string][octave] = newNode(key, context, now, waveform, octave)
        setGains(waveform, octave, now)
      })
    })
  },


  stopNote: (key: string) => {

    heldKeys = heldKeys.filter((heldKey: string) => heldKey !== key)
    const now = context.currentTime

    selectedWaveforms.forEach((waveform: string) => {
      selectedOctaves.forEach((octave: number) => {

        const targetGain = 0
        const release = 0.05

        setGain(key, waveform, octave, now, targetGain, release)
        keys[key].nodes![waveform][octave].oscillator.stop(now + release)
        setGains(waveform, octave, now)
      })
    })
  },
  

  toggleOctave: (octave: number) => {
    
    const now = context.currentTime

    if (!selectedOctaves.includes(octave)) {
      selectedOctaves.push(octave)

      heldKeys.forEach((key: string) => {
        selectedWaveforms.forEach((waveform: string) => {

          keys[key].nodes![waveform as string][octave] = newNode(key, context, now, waveform, octave)
        })
      })
      
      selectedWaveforms.forEach((waveform: string) => {
        selectedOctaves.forEach((octave: number) => {

          setGains(waveform, octave, now)
        })
      })  
    } else {
      selectedOctaves = selectedOctaves.filter((oct: number) => oct !== octave)
      
      heldKeys.forEach((key: string) => {
        selectedWaveforms.forEach((waveform: string) => {

          const targetGain = 0
          const releaseTime = 0.05

          setGain(key, waveform, octave, now, targetGain, releaseTime)
          keys[key].nodes![waveform][octave].oscillator.stop(now + releaseTime)
        })
      })

      selectedWaveforms.forEach((waveform: string) => {
        selectedOctaves.forEach((octave: number) => {
          setGains(waveform, octave, now)
        })
      })
    }
  },


  toggleWaveform: (waveform: string) => {
    
    const now = context.currentTime

    if (!selectedWaveforms.includes(waveform)) {

      selectedWaveforms.push(waveform)

      heldKeys.forEach((key: string) => {

        selectedOctaves.forEach((octave: number) => {
          keys[key].nodes![waveform as string][octave] = newNode(key, context, now, waveform, octave)
        })
      })

      selectedOctaves.forEach((octave: number) => {
        selectedWaveforms.forEach((waveform: string) => {
          setGains(waveform, octave, now)
        })
      })
    } else {

      selectedWaveforms = selectedWaveforms.filter((wave: string) => wave !== waveform)
      
      heldKeys.forEach((key: string) => {
        selectedOctaves.forEach((octave: number) => {

          const targetGain = 0
          const release = 0.05

          setGain(key, waveform, octave, now, targetGain, release)
          keys[key].nodes![waveform][octave].oscillator.stop(now + 0.05)
        })
      })

      selectedWaveforms.forEach((waveform: string) => {
        selectedOctaves.forEach((octave: number) => {
          setGains(waveform, octave, now)
        })
      })
    }
  },


  resume: () => {

    context.resume()
  }
}
