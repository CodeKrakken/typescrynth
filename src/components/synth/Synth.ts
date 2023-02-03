const context = new AudioContext();

const settings: Record<string, number | string> = {
  octave  : 4,
  waveShape: 'sine'
}

const ratio   = Math.pow(2, 1/12)
let frequency = 16.35
let notes     = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C+']

const keys = notes.map(((note, i) => {
  if (i) { frequency *= ratio }
  
  const key = {
    oscillator: context.createOscillator(),
    gain: context.createGain(),
    note: note,
    frequency: frequency
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
  
export const play = (note: string) => {
  const i = keys.findIndex(key => key.note === note)
  keys[i].oscillator.type = settings.waveShape as OscillatorType
  keys[i].oscillator.frequency.value = transpose(keys[i].frequency)
  keys[i].gain.gain.value = 1
}

export const stop = (note: string) => {
  const i = keys.findIndex(key => key.note === note)
  keys[i].gain.gain.value = 0
}

export const changeAttribute = (a: string, v: number | string) => {

  settings[a as string] = v

  keys.forEach(key => {
    if(key.gain.gain.value > 0) {
      play(key.note)
    }
  })
}
    
