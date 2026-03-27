import { synthSettings, node } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { Context } from 'vm'
import { getFrequency } from './functions'

let settings: synthSettings = defaultSettings
let context: AudioContext


// set up context

const getContext = () => {
  
  if (!context) { context = new AudioContext() }
  if (context.state === 'suspended') { context.resume() }
  
  return context
}

context = getContext()


// private functions

const newNode = (
  key: string, 
  waveform: string, 
  octave: number,
  now: number
) => {

  const oscillator = context.createOscillator()
  oscillator.type = waveform as OscillatorType
  oscillator.start(0)

  oscillator.frequency.setValueAtTime(
    getFrequency(keys[key].function as number, octave),
    now
  )

  const gain = context.createGain()
  gain.connect(context.destination)

  oscillator.connect(gain)
  
  return {
    oscillator: oscillator,
    gain: gain,
    key: key,
    octave: octave
  }
}


const balanceGains = (now: number) => {

  const balancedGain = 1/settings.activeNodes.length

  settings.activeNodes.forEach((node: node) => {
    setGain(node, now, balancedGain)
  })
}


const setGain = (
  node: node, 
  now: number, 
  targetGain: number, 
  releaseTime: number = 0
) => {
  node.gain.gain.cancelScheduledValues(now)
  node.gain.gain.setTargetAtTime(targetGain, now, releaseTime)
}


export const synth = {

  settings: settings,
  
  startNote: (key: string) => {

    settings.heldKeys.push(key)
    const now = context.currentTime

    settings.selectedWaveforms.forEach((waveform: string) => {
      settings.selectedOctaves.forEach((octave: number) => {
        settings.activeNodes.push(newNode(key, waveform, octave, now))
      })
    })

    balanceGains(now)
  },


  stopNote: (key: string) => {

    const now = context.currentTime
    const targetGain = 0
    const release = 0.05

    settings.activeNodes.filter((node: node) => node.key === key).forEach((node: node) => {

      setGain(node, now, targetGain, release)
      node.oscillator.stop(now + release)
    })

    settings.heldKeys = settings.heldKeys.filter((heldKey: string) => heldKey !== key)
    settings.activeNodes = settings.activeNodes.filter((node: node) => node.key !== key)

    balanceGains(now)
  },
  

  toggleOctave: (octave: number) => {
    
    const now = context.currentTime

    if (!settings.selectedOctaves.includes(octave)) {

      settings.selectedOctaves.push(octave)

      settings.heldKeys.forEach((key: string) => {
        settings.selectedWaveforms.forEach((waveform: string) => {
          settings.activeNodes.push(newNode(key, waveform, octave, now))
        })
      })
      balanceGains(now)

    } else {

      const targetGain = 0
      const releaseTime = 0.05
      
      settings.activeNodes.filter((node: node) => node.octave === octave).forEach((node: node) => {

        setGain(node, now, targetGain, releaseTime)
        node.oscillator.stop(now + releaseTime)
      })

      settings.selectedOctaves = settings.selectedOctaves.filter((thisOctave: number) => thisOctave !== octave)
      settings.activeNodes = settings.activeNodes.filter((node: node) => node.octave !== octave)

      balanceGains(now)
    }
  },


  toggleWaveform: (waveform: string) => {
    
    const now = context.currentTime

    if (!settings.selectedWaveforms.includes(waveform)) {
      settings.selectedWaveforms.push(waveform)

      settings.heldKeys.forEach((key: string) => {
        settings.selectedOctaves.forEach((octave: number) => {

          settings.activeNodes.push(newNode(key, waveform, octave, now))
        })
      })
      balanceGains(now)

    } else {

      settings.selectedWaveforms = settings.selectedWaveforms.filter((wave: string) => wave !== waveform)
      settings.activeNodes.filter((node: node) => node.oscillator.type === waveform).forEach((node: node) => {

        const targetGain = 0
        const releaseTime = 0.05

        setGain(node, now, targetGain, releaseTime)
        node.oscillator.stop(now + releaseTime)
      })
      balanceGains(now)
    }
  },


  resume: () => {
    context.resume()
  }
}
