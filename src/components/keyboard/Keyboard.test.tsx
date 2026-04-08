import { render, fireEvent } from '@testing-library/react'
import Keyboard from './Keyboard'
import {isActive} from './Keyboard'
import { synth } from '../synth/Synth'
import { randomColour } from './functions'


// --- mocks ---

jest.mock('../synth/Synth', () => ({
  synth: {
    toggleAttribute: jest.fn(),
    resume: jest.fn(),
    settings: {
      attributes: {
        baseFreqs: [],
        waveforms: [],
        octaves: []
      }
    }
  }
}))

jest.mock('../data', () => ({
  keys: {
    z: { type: 'baseFreq', function: '16.35', colour: '' },
    q: { type: 'waveform', function: 'sine', colour: '' }
  }
}))

jest.mock('./functions', () => ({
  randomColour: jest.fn(() => 'red'),
  keyStyle: jest.fn(() => ({})),
  generateKeyColours: jest.fn()
}))

jest.mock('./data', () => ({
  keySize: 50,
  rowOffset: 10
}))

describe('Keyboard', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all keys', () => {
    const { getByText } = render(<Keyboard />)

    expect(getByText('z')).toBeInTheDocument()
    expect(getByText('q')).toBeInTheDocument()
  })

  it('handles keydown and triggers synth', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'z' })

    expect(synth.resume).toHaveBeenCalled()
    expect(synth.toggleAttribute).toHaveBeenCalledWith('baseFreq', '16.35')
  })

  it('does not trigger on repeated keydown', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'z', repeat: true })

    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })

  it('handles keyup and releases note', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'z' })
    fireEvent.keyUp(document, { key: 'z' })

    expect(synth.toggleAttribute).toHaveBeenCalledTimes(2)
  })

  it('handles touchstart', () => {
    const { container } = render(<Keyboard />)
    const el = container.querySelector('[data-key="z"]')!

    fireEvent.touchStart(el, { target: el })

    expect(synth.toggleAttribute).toHaveBeenCalledWith('baseFreq', '16.35')
  })

  it('handles touchend', () => {
    const { container } = render(<Keyboard />)
    const el = container.querySelector('[data-key="z"]')!

    fireEvent.touchStart(el, { target: el })
    fireEvent.touchEnd(el, { target: el })

    expect(synth.toggleAttribute).toHaveBeenCalledTimes(2)
  })

  it('ignores unknown keys', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'a' })

    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })

  it('runs isActive and receives false', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = []
    expect(isActive('q')).toBeFalsy
  })

  it('runs isActive and receives true', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = ['sine']

    fireEvent.keyDown(document, { key: 'q' })

    expect(isActive('q')).toBeTruthy
  })

  it('handles inactive non-note keys', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = []

    fireEvent.keyDown(document, { key: 'q' })

    expect(synth.toggleAttribute).toHaveBeenCalled()
  })


  it('applies colour when key is active', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = ['sine']

    fireEvent.keyDown(document, { key: 'q' })

    expect(randomColour).toHaveBeenCalled()
  })

  it('prevents zoom when multiple touches', () => {
    render(<Keyboard />)

    const event = new Event('touchmove') as any

    event.touches = [{}, {}] // 2 touches
    event.preventDefault = jest.fn()

    document.dispatchEvent(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('does not prevent zoom for single touch', () => {
    render(<Keyboard />)

    const event = new Event('touchmove') as any

    event.touches = [{}] // 1 touch
    event.preventDefault = jest.fn()

    document.dispatchEvent(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })
})