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

let lastContextInstance: any

class MockAudioContext {
  currentTime = 0
  destination = {}
  state: 'running' | 'suspended' = 'running'

  createOscillator = jest.fn(() => mockOscillator())
  createGain = jest.fn(() => mockGain())
  resume = jest.fn()

  constructor() {
    lastContextInstance = this
  }
}

// @ts-ignore
global.AudioContext = MockAudioContext

describe('synth', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    synth.settings.attributes.baseFreqs = []
    synth.settings.attributes.waveforms = []
    synth.settings.attributes.octaves = []
    synth.settings.activeNodes = []
    synth.toggleAttribute('waveform', 'sine')
    synth.toggleAttribute('octave', '4')
  })

  it('adds attribute and creates nodes on toggle on', () => {
    synth.toggleAttribute('baseFreq', '16.35')

    expect(synth.settings.attributes.baseFreqs).toContain('16.35')
    expect(synth.settings.activeNodes.length).toBeGreaterThan(0)
  })

  it('removes attribute and stops nodes on toggle off', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('baseFreq', '16.35')

    expect(synth.settings.attributes.baseFreqs).not.toContain('16.35')
    expect(synth.settings.activeNodes.length).toBe(0)
  })

  it('creates multiple nodes for multiple waveforms', () => {
    synth.toggleAttribute('waveform', 'square')
    synth.toggleAttribute('baseFreq', '16.35')

    // 2 waveforms × 1 octave × 1 freq = 2 nodes
    expect(synth.settings.activeNodes.length).toBe(2)
  })

  it('creates multiple nodes for multiple octaves', () => {
    synth.toggleAttribute('octave', '0')
    synth.toggleAttribute('baseFreq', '16.35')

    // 2 waveforms × 1 octave × 1 freq = 2 nodes
    expect(synth.settings.activeNodes.length).toBe(2)
  })

  it('creates multiple nodes for multiple notes', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('baseFreq', '18.35')

    // 2 waveforms × 1 octave × 1 freq = 2 nodes
    expect(synth.settings.activeNodes.length).toBe(2)
  })

  it('creates oscillator and gain nodes', () => {
    synth.toggleAttribute('baseFreq', '16.35')

    const node = synth.settings.activeNodes[0]

    expect(node.oscillator.start).toHaveBeenCalled()
    expect(node.gain.connect).toHaveBeenCalled()
  })

  it('sets oscillator frequency', () => {
    synth.toggleAttribute('baseFreq', '16.35')

    const node = synth.settings.activeNodes[0]

    expect(node.oscillator.frequency.setValueAtTime).toHaveBeenCalled()
  })

  it('balances gain across nodes', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('waveform', 'sine')

    synth.settings.activeNodes.forEach(node => {
      expect(node.gain.gain.setTargetAtTime).toHaveBeenCalled()
    })
  })

  it('resume function calls audio context resume', () => {
    synth.resume()

    const audioContext = new AudioContext()
    expect(audioContext.resume).toBeDefined()
  })  
})

describe('synth - getContext', () => {

  beforeEach(() => {
    jest.resetModules() // 🔑 resets module-level `context`
  })

  it('resumes context if suspended', async () => {
    jest.resetModules()

    const { synth } = await import('./Synth')

    // first call creates context
    synth.resume()

    // force suspended
    lastContextInstance.state = 'suspended'

    // second call should trigger resume
    synth.resume()

    expect(lastContextInstance.resume).toHaveBeenCalled()
  })
})