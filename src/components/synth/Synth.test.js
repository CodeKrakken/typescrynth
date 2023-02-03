
import Synth from './Synth';
let synth

describe('synth', function() {
  beforeEach(function() {
    synth = new Synth()
  })

  it('can be initialised', function() {
    expect(synth).toBeDefined()
  })

  it('has an array for note objects', function() {
    expect(synth.state.notes).toBeDefined()
  })

  it('has an array for each note of the scale', function() {
    expect(Object.keys(synth.state.notes).length).toEqual(12)
  })

  it('can retrieve a frequency by note and octave', function() {
    expect(synth.getNote('C8')).toEqual(4186.01)
  })

  it('can calculate the frequency of a C9 according to its knowledge of a C8', function() {
    expect(synth.getNote('C9')).toEqual(8372.02)
  })

  it('can calculate the frequency of a B0 according to knowledge of a B8', function() {
    expect(synth.getNote('B0')).toEqual(30.87)
  })
})