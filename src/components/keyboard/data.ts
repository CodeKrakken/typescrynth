import { keysType } from './types'

export const keys: keysType = {
  '`': {label: '`', htmlTitle:  '0', function:  0, type: 'octave', isHeld: false, row: 1, column: 1}, 
  '1': {label: '1', htmlTitle:  '1', function:  1, type: 'octave', isHeld: false, row: 1, column: 2}, 
  '2': {label: '2', htmlTitle:  '2', function:  2, type: 'octave', isHeld: false, row: 1, column: 3}, 
  '3': {label: '3', htmlTitle:  '3', function:  3, type: 'octave', isHeld: false, row: 1, column: 4}, 
  '4': {label: '4', htmlTitle:  '4', function:  4, type: 'octave', isHeld: false, row: 1, column: 5}, 
  '5': {label: '5', htmlTitle:  '5', function:  5, type: 'octave', isHeld: false, row: 1, column: 6},
  '6': {label: '6', htmlTitle:  '6', function:  6, type: 'octave', isHeld: false, row: 1, column: 7}, 
  '7': {label: '7', htmlTitle:  '7', function:  7, type: 'octave', isHeld: false, row: 1, column: 8}, 
  '8': {label: '8', htmlTitle:  '8', function:  8, type: 'octave', isHeld: false, row: 1, column: 9}, 
  '9': {label: '9', htmlTitle:  '9', function:  9, type: 'octave', isHeld: false, row: 1, column: 10}, 
  '0': {label: '0', htmlTitle: '10', function: 10, type: 'octave', isHeld: false, row: 1, column: 11},

  'q': {label: 'q', htmlTitle: 'sine'    , function: 'sine', type: 'waveform', isHeld: false, row: 2, column: 2}, 
  'w': {label: 'w', htmlTitle: 'triangle', function: 'triangle', type: 'waveform', isHeld: false, row: 2, column: 3}, 
  'e': {label: 'e', htmlTitle: 'sawtooth', function: 'sawtooth', type: 'waveform', isHeld: false, row: 2, column: 4}, 
  'r': {label: 'r', htmlTitle: 'square'  , function: 'square', type: 'waveform', isHeld: false, row: 2, column: 5}, 

  's': {label: 's', htmlTitle: 'C#', function: 17.32, type: 'note', isHeld: false, row: 3, column: 4}, 
  'd': {label: 'd', htmlTitle: 'D#', function: 19.45, type: 'note', isHeld: false, row: 3, column: 5}, 
  'g': {label: 'g', htmlTitle: 'F#', function: 23.12, type: 'note', isHeld: false, row: 3, column: 7}, 
  'h': {label: 'h', htmlTitle: 'G#', function: 25.96, type: 'note', isHeld: false, row: 3, column: 8}, 
  'j': {label: 'j', htmlTitle: 'A#', function: 29.14, type: 'note', isHeld: false, row: 3, column: 9}, 

  'z': {label: 'z', htmlTitle: 'C',  function: 16.35, type: 'note', isHeld: false, row: 4, column: 3}, 
  'x': {label: 'x', htmlTitle: 'D', function: 18.35, type: 'note', isHeld: false, row: 4, column: 4}, 
  'c': {label: 'c', htmlTitle: 'E', function: 20.60, type: 'note', isHeld: false, row: 4, column: 5}, 
  'v': {label: 'v', htmlTitle: 'F', function: 21.83, type: 'note', isHeld: false, row: 4, column: 6}, 
  'b': {label: 'b', htmlTitle: 'G', function: 24.50, type: 'note', isHeld: false, row: 4, column: 7},
  'n': {label: 'n', htmlTitle: 'A', function: 27.50, type: 'note', isHeld: false, row: 4, column: 8},
  'm': {label: 'm', htmlTitle: 'B', function: 30.87, type: 'note', isHeld: false, row: 4, column: 9}, 
  ',': {label: ',', htmlTitle: 'C', function: 32.70, type: 'note', isHeld: false, row: 4, column: 10}
} 

export const keySize = 60
export const rowOffset = keySize / 2
