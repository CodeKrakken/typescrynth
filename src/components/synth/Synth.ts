import { synthSettings, node, settingsAttribute } from './types'
import { defaultSettings } from './data'
import { keys } from '../data'
import { getFrequency } from './functions'

let settings: synthSettings = defaultSettings
let context: AudioContext

type nodeAttribute = 'key' | 'waveform' | 'octave'

  const attrMap = {
    key: 'keys',
    waveform: 'waveforms',
    octave: 'octaves'
  } as const


// set up context

const getContext = () => {
  
  if (!context) { context = new AudioContext() }
  if (context.state === 'suspended') { context.resume() }
  
  return context
}

context = getContext()


// private functions

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

  settings[attrKey] = (settings[attrKey]).filter((attr: string) => attr !== value)
  settings.activeNodes = settings.activeNodes.filter((node: node) => node[attr] !== value)

  balanceGains(now)
}


export const synth = {

  settings: settings,
  
  startNote: (key: string) => {

    const now = context.currentTime

    synth.createNodes(now, 'key', key)

    // settings.keys.push(key)

    // settings.waveforms.forEach((waveform: string) => {
    //   settings.octaves.forEach((octave: string) => {
    //     settings.activeNodes.push(newNode({key, waveform, octave}, now))
    //   })
    // })

    // balanceGains(now)
  },


  stopNote: (key: string) => {

    const now = context.currentTime
    stopNodes(now, 'key', key)
  },

  

  toggleOctave: (octave: string) => {
    
    const now = context.currentTime

    if (!settings.octaves.includes(octave)) {

      synth.createNodes(now, 'octave', octave)

      // settings.octaves.push(octave)

      // settings.keys.forEach((key: string) => {
      //   settings.waveforms.forEach((waveform: string) => {
      //     settings.activeNodes.push(newNode(key, waveform, octave, now))
      //   })
      // })
      // balanceGains(now)

    } else {

      stopNodes(now, 'octave', octave)
    }
  },


  toggleWaveform: (waveform: string) => {
    
    const now = context.currentTime

    if (!settings.waveforms.includes(waveform)) {

      synth.createNodes(now, 'waveform', waveform)


      // settings.waveforms.push(waveform)

      // settings.keys.forEach((key: string) => {
      //   settings.octaves.forEach((octave: string) => {
      //     settings.activeNodes.push(newNode({key, waveform, octave}, now))
      //   })
      // })
      // balanceGains(now)

    } else {

      stopNodes(now, 'waveform', waveform)
    }
  },

  // createNodes: (now: number, attr: nodeAttribute, value: string) => {

  //   const attrKey = `${attr}s` as settingsAttribute

  //   settings[attrKey].push(value)

  //   const attrs = ['keys', 'waveforms', 'octaves'].filter((thisAttr: string) => thisAttr !== attr)

  //     settings.keys.forEach((key: string) => {
  //       settings.octaves.forEach((octave: string) => {
  //         settings.activeNodes.push(newNode(key, waveform, octave, now))
  //       })
  //     })
  //     balanceGains(now)
  // },

  createNodes: (
    now: number,
    attr: nodeAttribute,
    value: string
  ) => {

    const attrKey = attrMap[attr]

    // avoid duplicates
    if (!settings[attrKey].includes(value)) {
      settings[attrKey].push(value)
    }

    // get the OTHER two attributes
    const otherAttrs = (Object.keys(attrMap) as nodeAttribute[])
      .filter(a => a !== attr)

    const [attrA, attrB] = otherAttrs

    settings[attrMap[attrA]].forEach(valA => {
      settings[attrMap[attrB]].forEach(valB => {

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
  },


  resume: () => { context.resume() }
}
