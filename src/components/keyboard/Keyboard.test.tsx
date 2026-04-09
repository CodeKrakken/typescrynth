import { render, fireEvent } from '@testing-library/react'
import Keyboard from './Keyboard'
import { synth } from '../synth/Synth'


// mocks

jest.mock('../synth/Synth', () => ({
  synth: {
    toggleAttribute: jest.fn(),
    resume: jest.fn(),
    settings: {
      attributes: {
        waveforms: []
      }
    }
  }
}))


jest.mock('../data', () => ({
  keys: {
    z: { type: 'baseFreq', function: '16.35'},
    q: { type: 'waveform', function: 'sine'}
  }
}))


jest.mock('./functions', () => ({
  randomColour: jest.fn(() => 'red'),
  keyStyle: jest.fn(() => ({})),
  generateKeyColours: jest.fn()
}))


// test helper functions

const pressAndRelease = (key: string, repeat: string = '') => {
  if (repeat) return fireEvent.keyDown(document, { key: key, repeat: true })
  fireEvent.keyDown(document, { key: key })
  fireEvent.keyUp(document, { key: key })
}


const touchAndRelease = (key: string) => {
  const { container } = render(<Keyboard />)
  const target = container.querySelector(`[data-key="${key}"]`)!
  fireEvent.touchStart(target, { target: target })
  fireEvent.touchEnd(target, { target: target })
}


const newKeyEvent = (event: string) => {
  const div = document.createElement('div')
  const newEvent = new Event(event)
  Object.defineProperty(newEvent, 'target', { value: div })
  newEvent.preventDefault = jest.fn()
  return newEvent
}


// tests

describe('Keyboard', () => {

  // setup

  beforeEach(() => {
    jest.clearAllMocks()
  })


  // tests

  it('renders all keys', () => {
    const { getByText } = render(<Keyboard />)
    expect(getByText('z')).toBeInTheDocument()
    expect(getByText('q')).toBeInTheDocument()
  })


  it('handles touchstart', () => {
    const { container } = render(<Keyboard />)
    const target = container.querySelector('[data-key="z"]')!
    fireEvent.touchStart(target, { target: target })
    expect(synth.toggleAttribute).toHaveBeenCalledWith('baseFreq', '16.35')
  })


  it('handles touchend', () => {
    touchAndRelease('z')
    expect(synth.toggleAttribute).toHaveBeenCalledTimes(2)
  })
})


describe('Keyboard', () => {

  // setup

  beforeEach(() => {
    jest.clearAllMocks()
    render(<Keyboard />)
  })
    

  // tests

  it('handles keydown and triggers synth', () => {
    pressAndRelease('z')
    expect(synth.toggleAttribute).toHaveBeenCalledWith('baseFreq', '16.35')
  })


  it('does not trigger on repeated keydown', () => {
    pressAndRelease('z', 'repeat')
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })


  it('handles keyup and releases note', () => {
    pressAndRelease('z')
    expect(synth.toggleAttribute).toHaveBeenCalledTimes(2)
  })


  it('does not toggle attribute for waveform on keyup', () => {
    pressAndRelease('q')
    expect(synth.toggleAttribute).toHaveBeenCalledTimes(1)
  })


  it('ignores touchstart when no data-key is present', () => {
    const event = newKeyEvent('touchstart')
    document.dispatchEvent(event)
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })
  

  it('ignores touchend when no data-key is present', () => {
    const event = newKeyEvent('touchend')
    document.dispatchEvent(event)
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })
  

  it('ignores unknown keys', () => {
    pressAndRelease('a')
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })


  it('handles inactive non-note keys', () => {
    synth.settings.attributes.waveforms = []
    pressAndRelease('q')
    expect(synth.toggleAttribute).toHaveBeenCalledWith('waveform', 'sine')
  })
})
