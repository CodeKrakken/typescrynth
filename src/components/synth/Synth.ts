export function Synth() {

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

  type settings = {
    octave: number
    waveShape: string
  }

  const settings: settings = {
    octave: 4,
    waveShape: 'sine'
  }

  const ratio   = Math.pow(2, 1/12)
  let frequency = 16.35
  let notes     = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C+']

  const keys = notes.map(((note, i) => {
    if (i) { frequency *= ratio }

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
    
  const play = (note: string) => {
    const context = getContext()
    const i = keys.findIndex(key => key.note === note)
    keys[i].oscillator.type = settings.waveShape as OscillatorType
    keys[i].oscillator.frequency.value = transpose(keys[i].frequency)
    const now = context.currentTime
    keys[i].gain.gain.cancelScheduledValues(now)
    keys[i].gain.gain.setTargetAtTime(1, now, 0.01)
    keys[i].isPlaying = true
  }

  const stop = (note: string) => {
    const context = getContext()
    const i = keys.findIndex(key => key.note === note)
    const now = context.currentTime
    keys[i].gain.gain.cancelScheduledValues(now)
    keys[i].gain.gain.setTargetAtTime(0, now, 0.01)
    keys[i].isPlaying = false
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

  const changeAttribute = <K extends keyof settings>(
    key: K,
    value: settings[K]
  ) => {
    settings[key] = value

    if (key === 'octave') {
      updateFrequencies()
    }

    if (key === 'waveShape') {
      updateWaveShape()
    }
  }

  const updateWaveShape = () => {
    keys.forEach(key => {
      if (key.isPlaying) {
        key.oscillator.type = settings.waveShape as OscillatorType
      }
    })
  }

  const resume = () => {
    const context = getContext()
    context.resume()
  }

  return {
    play,
    stop,
    changeAttribute,
    resume
  };
}
