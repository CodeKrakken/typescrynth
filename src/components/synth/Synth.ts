import { synthSettings, node, nodeAttribute, settingsAttribute } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
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
  octave: string,
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
    octave: octave,
    waveform: waveform
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

    settings.keys.push(key)
    const now = context.currentTime

    settings.waveforms.forEach((waveform: string) => {
      settings.octaves.forEach((octave: string) => {
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

    settings.keys = settings.keys.filter((heldKey: string) => heldKey !== key)
    settings.activeNodes = settings.activeNodes.filter((node: node) => node.key !== key)

    balanceGains(now)
  },



  stopNodes: (now: number, attr: nodeAttribute, value: string) => {
    const targetGain = 0
    const releaseTime = 0.05
    
    settings.activeNodes.filter((node: node) => node[attr] === value).forEach((node: node) => {

      setGain(node, now, targetGain, releaseTime)
      node.oscillator.stop(now + releaseTime)
    })

    const attrKey = `${attr}s` as settingsAttribute

    settings[attrKey] = (settings[attrKey]).filter((attr: string) => attr !== value)
    settings.activeNodes = settings.activeNodes.filter((node: node) => node[attr] !== value)

    balanceGains(now)
  },
  

  toggleOctave: (octave: string) => {
    
    const now = context.currentTime

    if (!settings.octaves.includes(octave)) {

      settings.octaves.push(octave)

      settings.keys.forEach((key: string) => {
        settings.waveforms.forEach((waveform: string) => {
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

      settings.octaves = settings.octaves.filter((thisOctave: string) => thisOctave !== octave)
      settings.activeNodes = settings.activeNodes.filter((node: node) => node.octave !== octave)

      balanceGains(now)
    }
  },


  toggleWaveform: (waveform: string) => {
    
    const now = context.currentTime

    if (!settings.waveforms.includes(waveform)) {

      settings.waveforms.push(waveform)

      settings.keys.forEach((key: string) => {
        settings.octaves.forEach((octave: string) => {
          settings.activeNodes.push(newNode(key, waveform, octave, now))
        })
      })
      balanceGains(now)

    } else {

      const targetGain = 0
      const releaseTime = 0.05
      
      settings.activeNodes.filter((node: node) => node.oscillator.type === waveform).forEach((node: node) => {

        setGain(node, now, targetGain, releaseTime)
        node.oscillator.stop(now + releaseTime)
      })

      settings.waveforms = settings.waveforms.filter((thisWaveform: string) => thisWaveform !== waveform)
      settings.activeNodes = settings.activeNodes.filter((node: node) => node.oscillator.type !== waveform)

      balanceGains(now)
    }
  },


  resume: () => { context.resume() }
}
