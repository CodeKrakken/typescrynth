import { synthSettings, node } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { Context } from 'vm'
import { getFrequency } from './functions'

let context: AudioContext
let settings: synthSettings = defaultSettings

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


const setGains = (now: number) => {

  settings.activeNodes.forEach((node: node) => {

    const targetGain = 1/settings.heldKeys.length/settings.selectedWaveforms.length/settings.selectedOctaves.length
    const releaseTime = 0

    setGain(node, now, targetGain, releaseTime)
  })
}


const setGain = (
  node: node, 
  now: number, 
  targetGain: number, 
  releaseTime: number = 0
) => {
  node.gain.gain.cancelScheduledValues(now)
  try {
    node.gain.gain.setTargetAtTime(targetGain, now, releaseTime)
  } catch (error) {
    console.log(targetGain)
  }
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
    gain: gain,
    key: key,
    octave: octave
  }
}


export const synth = {

  settings: settings,
  
  startNote: (key: string) => {

    settings.heldKeys.push(key)
    const now = context.currentTime

    settings.selectedWaveforms.forEach((waveform: string) => {
      settings.selectedOctaves.forEach((octave: number) => {
        settings.activeNodes.push(newNode(key, context, now, waveform, octave))
      })
    })

    setGains(now)
  },


  stopNote: (key: string) => {

    const now = context.currentTime

    settings.activeNodes.filter((node: node) => node.key === key).forEach((node: node) => {

      const targetGain = 0
      const release = 0.05

      setGain(node, now, targetGain, release)
      node.oscillator.stop(now + release)
    })

    settings.heldKeys = settings.heldKeys.filter((heldKey: string) => heldKey !== key)
    settings.activeNodes = settings.activeNodes.filter((node: node) => node.key !== key)

    setGains(now)
  },
  

  toggleOctave: (octave: number) => {
    
    const now = context.currentTime

    if (!settings.selectedOctaves.includes(octave)) {

      settings.selectedOctaves.push(octave)
      console.log(settings.selectedOctaves)

      settings.heldKeys.forEach((key: string) => {
        settings.selectedWaveforms.forEach((waveform: string) => {
          settings.activeNodes.push(newNode(key, context, now, waveform, octave))
        })
      })
      setGains(now)

    } else {
      settings.selectedOctaves = settings.selectedOctaves.filter((oct: number) => oct !== octave)
      console.log(settings.selectedOctaves)

      settings.activeNodes.filter((node: node) => node.octave === octave).forEach((node: node) => {

        const targetGain = 0
        const releaseTime = 0.05

        setGain(node, now, targetGain, releaseTime)
        node.oscillator.stop(now + releaseTime)
      })

      setGains(now)
    }
  },


  toggleWaveform: (waveform: string) => {
    
    const now = context.currentTime

    if (!settings.selectedWaveforms.includes(waveform)) {
      settings.selectedWaveforms.push(waveform)

      settings.heldKeys.forEach((key: string) => {

        settings.selectedOctaves.forEach((octave: number) => {
          settings.activeNodes.push(newNode(key, context, now, waveform, octave))
        })
      })
      setGains(now)

    } else {
      settings.selectedWaveforms = settings.selectedWaveforms.filter((wave: string) => wave !== waveform)

      settings.activeNodes.filter((node: node) => node.oscillator.type === waveform).forEach((node: node) => {

        const targetGain = 0
        const releaseTime = 0.05

        setGain(node, now, targetGain, releaseTime)
        node.oscillator.stop(now + releaseTime)
      })
      setGains(now)
    }
  },


  resume: () => {
    context.resume()
  }
}
