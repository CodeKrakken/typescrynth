import { render, fireEvent } from '@testing-library/react'
import Keyboard from './components/keyboard/Keyboard'
import { synth } from './components/synth/Synth'
import { AudioContextMock } from "./mocks";

global.AudioContext = jest.fn(() => AudioContextMock) as unknown as typeof AudioContext

let target: HTMLElement

describe('App', () => {

  beforeEach(() => {
    jest.clearAllMocks()

    synth.settings.attributes.baseFreqs = []
    synth.settings.attributes.waveforms = ['sine']
    synth.settings.attributes.octaves = ['4']
    synth.settings.activeNodes = []

    target = render(<Keyboard />).container.querySelector(`[data-key="z"]`)!
  })


  it('creates oscillator on key down', () => {
    fireEvent.keyDown(document, { key: 'z' })

    expect(AudioContextMock.createOscillator).toHaveBeenCalled()
  })


  it('plays a note on key down', () => {
    fireEvent.keyDown(document, { key: 'z' })

    expect(synth.settings.attributes.baseFreqs).toContain('16.35')
    expect(synth.settings.activeNodes.length).toBeGreaterThan(0)
  })


  it('stops note on key up', () => {
    fireEvent.keyDown(document, { key: 'z' })

    expect(synth.settings.attributes.baseFreqs).toContain('16.35')
    expect(synth.settings.activeNodes.length).toBeGreaterThan(0)

    fireEvent.keyUp(document, { key: 'z' })

    expect(synth.settings.attributes.baseFreqs).not.toContain('16.35')
    expect(synth.settings.activeNodes.length).toBe(0)
  })


  it('creates oscillator on touch start', () => {
    fireEvent.touchStart(target)

    expect(AudioContextMock.createOscillator).toHaveBeenCalled()
  })


  it('plays a note on touch start', () => {    
    fireEvent.touchStart(target)

    expect(synth.settings.attributes.baseFreqs).toContain('16.35')
    expect(synth.settings.activeNodes.length).toBeGreaterThan(0)
  })
  

  it('stops note on touch end', () => {    
    fireEvent.touchStart(target)

    expect(synth.settings.attributes.baseFreqs).toContain('16.35')
    expect(synth.settings.activeNodes.length).toBeGreaterThan(0)

    fireEvent.touchEnd(target)

    expect(synth.settings.attributes.baseFreqs).not.toContain('16.35')
    expect(synth.settings.activeNodes.length).toBe(0)
  })
})


  
