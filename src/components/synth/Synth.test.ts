import { synth } from './Synth'
import { MockAudioContext } from './types';


// mock context

const AudioContextMock: MockAudioContext = {
  createOscillator: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn(),
    frequency: {
      setValueAtTime: jest.fn()
    }
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      cancelScheduledValues: jest.fn(),
      setTargetAtTime: jest.fn()
    }
  })),
  resume: jest.fn(),
  currentTime: 0,
  state: 'running' as 'running' | 'suspended'
};

global.AudioContext = jest.fn(() => AudioContextMock) as unknown as typeof AudioContext

describe('synth', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    synth.settings.attributes.baseFreqs = []
    synth.settings.attributes.waveforms = ['sine']
    synth.settings.attributes.octaves = ['4']
    synth.settings.activeNodes = []    
  })


  it('resumes context if suspended', () => {
    AudioContextMock.state = 'suspended'
    synth.resume()
    expect(AudioContextMock.resume).toHaveBeenCalled()
  })


  it('does not resume context if running', () => {
    AudioContextMock.state = 'running'
    synth.resume()
    expect(AudioContextMock.resume).not.toHaveBeenCalled()
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


  it('removes nodes from activeNodes when toggled off', () => {
    synth.toggleAttribute('baseFreq', '16.35')
    synth.toggleAttribute('baseFreq', '16.35')

    expect(synth.settings.activeNodes.length).toBe(0)
  })
})
