export default function Synth() {

  const context = new AudioContext();
  // context.resume()

  const settings = {
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
    
  this.play = (note) => {
    const i = keys.findIndex(key => key.note === note)
    keys[i].oscillator.type = settings.waveShape
    keys[i].oscillator.frequency.value = transpose(keys[i].frequency)
    console.log(transpose(keys[i].frequency))
    keys[i].gain.gain.value = 1
  }

  this.stop = (note) => {
    const i = keys.findIndex(key => key.note === note)
    
    keys[i].gain.gain.value = 0
  }

  this.changeAttribute = (a, v) => {

    settings[a] = v

    keys.forEach(key => {
      if(key.gain.gain.value > 0) {
        this.play(key.note)
      }
    })
  }
     
  const transpose = (frequency) => {

    for ( let i = 0 ; i < settings.octave; i++ ) {
      frequency *= 2
    }
    return +frequency.toFixed(2)
  }
}
