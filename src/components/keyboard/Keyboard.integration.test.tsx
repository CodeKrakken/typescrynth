import { render, fireEvent } from '@testing-library/react'
import Keyboard from './Keyboard'
import { synth } from '../synth/Synth'
import { AudioContextMock } from "../mocks";

global.AudioContext = jest.fn(() => AudioContextMock) as unknown as typeof AudioContext

beforeEach(() => {
  jest.clearAllMocks()

  synth.settings.attributes.baseFreqs = []
  synth.settings.attributes.waveforms = ['sine']
  synth.settings.attributes.octaves = ['4']
  synth.settings.activeNodes = []
})

it('plays a note end-to-end', () => {
  render(<Keyboard />)

  fireEvent.keyDown(document, { key: 'z' })

  expect(synth.settings.attributes.baseFreqs).toContain('16.35')
  expect(synth.settings.activeNodes.length).toBeGreaterThan(0)
})

it('stops note on keyup', () => {
  render(<Keyboard />)

  fireEvent.keyDown(document, { key: 'z' })
  fireEvent.keyUp(document, { key: 'z' })

  expect(synth.settings.attributes.baseFreqs).not.toContain('16.35')
  expect(synth.settings.activeNodes.length).toBe(0)
})

it('creates oscillator when key is pressed', () => {
  render(<Keyboard />)

  fireEvent.keyDown(document, { key: 'z' })

  expect(AudioContextMock.createOscillator).toHaveBeenCalled()
})