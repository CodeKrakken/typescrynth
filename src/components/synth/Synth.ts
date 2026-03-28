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

const createNodes = (
  now: number,
  attr: nodeAttribute,
  value: string
) => {

  const attrKey = `${attr}s` as settingsAttribute

  settings.attributes[attrKey].push(value)

  const allAttrs: nodeAttribute[] = ['key', 'waveform', 'octave']    
  const otherAttrs = allAttrs.filter(a => a !== attr)
  const [attrA, attrB] = otherAttrs    
  const attrAKey = `${attrA}s` as settingsAttribute
  const attrBKey = `${attrB}s` as settingsAttribute

  settings.attributes[attrAKey].forEach(valA => {
    settings.attributes[attrBKey].forEach(valB => {

      const nodeParams = {
        key: '',
        waveform: '',
        octave: ''
      }

      nodeParams[attr] = value
      nodeParams[attrA] = valA
      nodeParams[attrB] = valB

      settings.activeNodes.push(newNode(nodeParams, now))
    })
  })

  balanceGains(now)
}



const newNode = (
  { key, waveform, octave }: { key: string; waveform: string; octave: string },
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


const stopNodes = (now: number, attr: nodeAttribute, value: string) => {
  const targetGain = 0
  const releaseTime = 0.05
  
  settings.activeNodes.filter((node: node) => node[attr] === value).forEach((node: node) => {

    setGain(node, now, targetGain, releaseTime)
    node.oscillator.stop(now + releaseTime)
  })

  const attrKey = `${attr}s` as settingsAttribute

  settings.attributes[attrKey] = (settings.attributes[attrKey]).filter((attr: string) => attr !== value)
  settings.activeNodes = settings.activeNodes.filter((node: node) => node[attr] !== value)

  balanceGains(now)
}


export const synth = {

  settings: settings,

    // Refactor these three toggle functions into one generic one that takes the attribute as an argument
  
  toggleNote: (key: string) => {
  
    const now = context.currentTime

    if (!settings.attributes.keys.includes(key)) {
      createNodes(now, 'key', key)
    } else {
      stopNodes(now, 'key', key)
    }
  
  },


  toggleOctave: (octave: string) => {

    
    const now = context.currentTime


    if (!settings.attributes.octaves.includes(octave)) {
      createNodes(now, 'octave', octave)

    } else {
      stopNodes(now, 'octave', octave)
    }
  },


  toggleWaveform: (waveform: string) => {
    
    const now = context.currentTime

    if (!settings.attributes.waveforms.includes(waveform)) {
      createNodes(now, 'waveform', waveform)

    } else {
      stopNodes(now, 'waveform', waveform)
    }
  },

  
  toggleAttribute: (attribute: nodeAttribute, value: string) => {
    const now = context.currentTime

    if (!settings.attributes[`${attribute}s`].includes(value)) {
      console.log(settings.attributes)
      createNodes(now, attribute, value)
    } else {
      console.log(settings.attributes)
      stopNodes(now, attribute, value)
    }
  },

  resume: () => { context.resume() }
}
