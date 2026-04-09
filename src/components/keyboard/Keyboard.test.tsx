import { render, fireEvent } from '@testing-library/react'
import Keyboard from './Keyboard'
import { isActive } from './Keyboard'
import { synth } from '../synth/Synth'
import { randomColour } from './functions'


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


const newEvent = (event: string) => {
  const div = document.createElement('div')
  const newEvent = new Event(event, { bubbles: true })
  Object.defineProperty(newEvent, 'target', { value: div })
  newEvent.preventDefault = jest.fn()
  return newEvent
}


const newTouchEvent = (touchCount: number) => {
  const newEvent = new Event('touchmove', { bubbles: true })
  const preventDefault = jest.fn()
  const touches = []

  for (let i = 0; i < touchCount; i++) {
    touches.push({})
  }

  Object.defineProperty(newEvent, 'touches',         { value: touches })    
  Object.defineProperty(newEvent, 'preventDefault',  { value: preventDefault })
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
    expect(synth.resume).toHaveBeenCalled()
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
    const event = newEvent('touchstart')
    document.dispatchEvent(event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })
  

  it('ignores touchend when no data-key is present', () => {
    const event = newEvent('touchend')
    document.dispatchEvent(event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })
  

  it('ignores unknown keys', () => {
    pressAndRelease('a')
    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })


  it('handles inactive non-note keys', () => {
    synth.settings.attributes.waveforms = []
    pressAndRelease('q')
    expect(synth.toggleAttribute).toHaveBeenCalled()
  })


  it('prevents zoom when multiple touches', () => {
    const newEvent = newTouchEvent(2)
    document.dispatchEvent(newEvent)
    expect(newEvent.preventDefault).toHaveBeenCalled()
  })


  it('does not prevent zoom for single touch', () => {
    const newEvent = newTouchEvent(1)
    document.dispatchEvent(newEvent)
    expect(newEvent.preventDefault).not.toHaveBeenCalled()
  })
})
