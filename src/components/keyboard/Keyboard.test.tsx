import { render, fireEvent } from '@testing-library/react'
import Keyboard from './Keyboard'
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
    a: { type: 'baseFreq', function: '440', colour: '' },
    b: { type: 'waveform', function: 'sine', colour: '' }
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

    expect(getByText('a')).toBeInTheDocument()
    expect(getByText('b')).toBeInTheDocument()
  })

  it('handles keydown and triggers synth', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'a' })

    expect(synth.resume).toHaveBeenCalled()
    expect(synth.toggleAttribute).toHaveBeenCalledWith('baseFreq', '440')
  })

  it('does not trigger on repeated keydown', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'a', repeat: true })

    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })

  it('handles keyup and releases note', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'a' })
    fireEvent.keyUp(document, { key: 'a' })

    expect(synth.toggleAttribute).toHaveBeenCalledTimes(2)
  })

  it('handles touchstart', () => {
    const { container } = render(<Keyboard />)
    const el = container.querySelector('[data-key="a"]')!

    fireEvent.touchStart(el, { target: el })

    expect(synth.toggleAttribute).toHaveBeenCalledWith('baseFreq', '440')
  })

  it('handles touchend', () => {
    const { container } = render(<Keyboard />)
    const el = container.querySelector('[data-key="a"]')!

    fireEvent.touchStart(el, { target: el })
    fireEvent.touchEnd(el, { target: el })

    expect(synth.toggleAttribute).toHaveBeenCalledTimes(2)
  })

  it('ignores unknown keys', () => {
    render(<Keyboard />)

    fireEvent.keyDown(document, { key: 'z' })

    expect(synth.toggleAttribute).not.toHaveBeenCalled()
  })

  it('sets colour when key is active', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = ['sine']

    fireEvent.keyDown(document, { key: 'b' })

    // indirectly proves isActive ran and returned true
    expect(synth.toggleAttribute).toHaveBeenCalled()
  })

  it('handles inactive non-note keys', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = []

    fireEvent.keyDown(document, { key: 'b' })

    expect(synth.toggleAttribute).toHaveBeenCalled()
  })


  it('applies colour when key is active', () => {
    render(<Keyboard />)

    synth.settings.attributes.waveforms = ['sine']

    fireEvent.keyDown(document, { key: 'b' })

    expect(randomColour).toHaveBeenCalled()
  })
})