import { synthSettings, node, nodeAttribute, settingsAttribute } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { calculateFrequency } from './functions'
import { nodeAttrs } from './data'

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
  updatedAttr: nodeAttribute,
  value: string
) => {

  const attrKey = `${updatedAttr}s` as settingsAttribute

  settings.attributes[attrKey].push(value)

  const retainedAttrs = nodeAttrs.filter(attr => attr !== updatedAttr)
  const [attrA, attrB] = retainedAttrs    
  const attrAKey = `${attrA}s` as settingsAttribute
  const attrBKey = `${attrB}s` as settingsAttribute

  settings.attributes[attrAKey].forEach(valueA => {
    settings.attributes[attrBKey].forEach(valueB => {

      const nodeAttrs = {
        baseFreq: '',
        waveform: '',
        octave: ''
      }

      nodeAttrs[updatedAttr] = value
      nodeAttrs[attrA] = valueA
      nodeAttrs[attrB] = valueB

      settings.activeNodes.push(newNode(nodeAttrs, now))
    })
  })

  balanceGains(now)
}


const newNode = (
  { 
    baseFreq, 
    waveform, 
    octave 
  }: { 
    baseFreq: string; 
    waveform: string; 
    octave: string 
  },
  now: number
) => {

  const oscillator = context.createOscillator()
  oscillator.type = waveform as OscillatorType
  oscillator.start(0)

  oscillator.frequency.setValueAtTime(
    calculateFrequency(+baseFreq as number, octave),
    now
  )

  const gain = context.createGain()
  gain.connect(context.destination)

  oscillator.connect(gain)
  
  return {
    oscillator: oscillator,
    gain: gain,
    baseFreq: baseFreq,
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
  
  toggleAttribute: (attribute: nodeAttribute, value: string) => {
    const now = context.currentTime

    !settings.attributes[`${attribute}s`].includes(value) ? 
    createNodes(now, attribute, value) : 
    stopNodes(now, attribute, value)
    
  },

  resume: () => { context.resume() }
}
