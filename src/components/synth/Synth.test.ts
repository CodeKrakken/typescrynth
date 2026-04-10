let synth: typeof import('./Synth').synth

// mocks

const mockOscillator = () => ({
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

const MockAudioContext = global.AudioContext as jest.Mock

// const instance = MockAudioContext.mock.instances[0]

const createMockAudioContext = () => ({
  createOscillator: jest.fn(() => mockOscillator()),
  createGain: jest.fn(() => mockGain()),
  resume: jest.fn(),
  currentTime: 0,
  state: 'running' as 'running' | 'suspended'
})

describe('synth', () => {

  beforeEach(async () => {
    jest.resetModules()

    ;(global as any).AudioContext = jest.fn(() => createMockAudioContext())

    const module = await import('./Synth')
    synth = module.synth

    // now safe to initialise state
    synth.settings.attributes.baseFreqs = []
    synth.settings.attributes.waveforms = ['sine']
    synth.settings.attributes.octaves = ['4']
    synth.settings.activeNodes = []
  })

  it('adds attribute and creates nodes on toggle on', () => {
    synth.toggleAttribute('baseFreq', '16.35')

    expect(synth.settings.attributes.baseFreqs).toContain('16.35')
    expect(synth.settings.activeNodes.length).toBe(1)
  })


  it('removes attribute and stops nodes on toggle off', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('baseFreq', '16.35')

    expect(synth.settings.attributes.baseFreqs).not.toContain('16.35')
    expect(synth.settings.activeNodes.length).toBe(0)
  })


  it('creates oscillator and gain nodes', () => {
    synth.toggleAttribute('baseFreq', '16.35')

    const node = synth.settings.activeNodes[0]

    expect(node.oscillator.start).toHaveBeenCalled()
    expect(node.gain.connect).toHaveBeenCalled()
  })


  it('balances gain across nodes', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('baseFreq', '18.35')

    const gainNode = synth.settings.activeNodes[0].gain.gain
    const calls = (gainNode.setTargetAtTime as jest.Mock).mock.calls
    const expectedGain = 1/synth.settings.activeNodes.length

    expect(calls.some(call => call[0] === expectedGain)).toBe(true)
  })


  it('resumes context if suspended', () => {
    synth.resume()

    const instance = (global.AudioContext as jest.Mock).mock.instances[0]

    instance.state = 'suspended'

    synth.resume()

    expect(instance.resume).toHaveBeenCalled()
  })


  it('removes nodes from activeNodes when toggled off', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('baseFreq', '16.35')

    expect(synth.settings.activeNodes.length).toBe(0)
  })
})
