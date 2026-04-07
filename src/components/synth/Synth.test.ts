import { synth } from './Synth'

// --- AudioContext mock ---

const mockOscillator = () => ({
  type: '',
  start: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  frequency: {
    setValueAtTime: jest.fn()
  }
})

const mockGain = () => ({
  connect: jest.fn(),
  gain: {
    cancelScheduledValues: jest.fn(),
    setTargetAtTime: jest.fn()
  }
})

class MockAudioContext {
  currentTime = 0
  destination = {}
  state = 'running'

  createOscillator = jest.fn(() => mockOscillator())
  createGain = jest.fn(() => mockGain())
  resume = jest.fn()
}

// @ts-ignore
global.AudioContext = MockAudioContext

describe('synth', () => {

  beforeEach(() => {
    jest.clearAllMocks()

    synth.settings.attributes.baseFreqs = []
    synth.settings.attributes.waveforms = ['sine']
    synth.settings.attributes.octaves = ['4']
    synth.settings.activeNodes = []
  })

  it('adds attribute and creates nodes on toggle on', () => {
    synth.toggleAttribute('baseFreq', '440')

    expect(synth.settings.attributes.baseFreqs).toContain('440')
    expect(synth.settings.activeNodes.length).toBeGreaterThan(0)
  })

  it('removes attribute and stops nodes on toggle off', () => {
    synth.toggleAttribute('baseFreq', '440')
    synth.toggleAttribute('baseFreq', '440')

    expect(synth.settings.attributes.baseFreqs).not.toContain('440')
    expect(synth.settings.activeNodes.length).toBe(0)
  })

  it('creates oscillator and gain nodes', () => {
    synth.toggleAttribute('baseFreq', '440')

    const node = synth.settings.activeNodes[0]

    expect(node.oscillator.start).toHaveBeenCalled()
    expect(node.gain.connect).toHaveBeenCalled()
  })

  it('sets oscillator frequency', () => {
    synth.toggleAttribute('baseFreq', '440')

    const node = synth.settings.activeNodes[0]

    expect(node.oscillator.frequency.setValueAtTime).toHaveBeenCalled()
  })

  it('balances gain across nodes', () => {
    synth.toggleAttribute('baseFreq', '440')
    synth.toggleAttribute('waveform', 'sine')

    synth.settings.activeNodes.forEach(node => {
      expect(node.gain.gain.setTargetAtTime).toHaveBeenCalled()
    })
  })

  it('resume calls audio context resume', () => {
    synth.resume()

    const ctx = new AudioContext()
    expect(ctx.resume).toBeDefined()
  })
})