import {synthSettings} from './types'
import { notes, baseFrequency, defaultSettings, noteRatio } from './data'

let context: AudioContext | null = null
let frequency = baseFrequency
const settings: synthSettings = defaultSettings

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

const keys = notes.map(((note, i) => {
  if (i) { frequency *= noteRatio }

  const context = getContext()
  
  const key = {
    oscillator: context.createOscillator(),
    gain: context.createGain(),
    note: note,
    frequency: frequency,
    isPlaying: false
  }

  key.oscillator.connect(key.gain)
  key.gain.connect(context.destination)
  key.gain.gain.value = 0
  key.oscillator.start(0)

  return key
}))

const transpose = (frequency: number) => {

  for ( let i = 0 ; i < settings.octave; i++ ) {
    frequency *= 2
  }
  return +frequency.toFixed(2)
}

const updateFrequencies = () => {
  const context = getContext()
  const now = context.currentTime

  keys.forEach(key => {
    if (key.isPlaying) {
      key.oscillator.frequency.setValueAtTime(
        transpose(key.frequency),
        now
      )
    }
  })
}

const updateWaveShape = () => {
  keys.forEach(key => {
    if (key.isPlaying) {
      key.oscillator.type = settings.waveShape as OscillatorType
    }
  })
}


// Synth

export const synth = {
  
  play: (note: string) => {
    const context = getContext()
    const i = keys.findIndex(key => key.note === note)
    keys[i].oscillator.type = settings.waveShape as OscillatorType
    keys[i].oscillator.frequency.value = transpose(keys[i].frequency)
    const now = context.currentTime
    keys[i].gain.gain.cancelScheduledValues(now)
    keys[i].gain.gain.setTargetAtTime(1, now, 0.01)
    keys[i].isPlaying = true
  },

  stop: (note: string) => {
    const context = getContext()
    const i = keys.findIndex(key => key.note === note)
    const now = context.currentTime
    keys[i].gain.gain.cancelScheduledValues(now)
    keys[i].gain.gain.setTargetAtTime(0, now, 0.01)
    keys[i].isPlaying = false
  },
  
  changeAttribute: <K extends keyof synthSettings>(
    key: K,
    value: synthSettings[K]
  ) => {
    settings[key] = value

    if (key === 'octave') {
      updateFrequencies()
    }

    if (key === 'waveShape') {
      updateWaveShape()
    }
  },

  resume: () => {
    const context = getContext()
    context.resume()
  }

}
