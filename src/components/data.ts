import { keysType } from './types'

export const keys: keysType = {
  '`': {htmlTitle:  '0',        function:  '0',         type: 'octave',   isHeld: false, row: 0, column: -6, colour: ''}, 
  '1': {htmlTitle:  '1',        function:  '1',         type: 'octave',   isHeld: false, row: 0, column: -5, colour: ''}, 
  '2': {htmlTitle:  '2',        function:  '2',         type: 'octave',   isHeld: false, row: 0, column: -4, colour: ''}, 
  '3': {htmlTitle:  '3',        function:  '3',         type: 'octave',   isHeld: false, row: 0, column: -3, colour: ''}, 
  '4': {htmlTitle:  '4',        function:  '4',         type: 'octave',   isHeld: false, row: 0, column: -2, colour: ''}, 
  '5': {htmlTitle:  '5',        function:  '5',         type: 'octave',   isHeld: false, row: 0, column: -1, colour: ''},
  '6': {htmlTitle:  '6',        function:  '6',         type: 'octave',   isHeld: false, row: 0, column:  0, colour: ''}, 
  '7': {htmlTitle:  '7',        function:  '7',         type: 'octave',   isHeld: false, row: 0, column:  1, colour: ''}, 
  '8': {htmlTitle:  '8',        function:  '8',         type: 'octave',   isHeld: false, row: 0, column:  2, colour: ''}, 
  '9': {htmlTitle:  '9',        function:  '9',         type: 'octave',   isHeld: false, row: 0, column:  3, colour: ''}, 
  '0': {htmlTitle: '10',        function: '10',         type: 'octave',   isHeld: false, row: 0, column:  4, colour: ''},

  'q': {htmlTitle: 'sine',      function: 'sine',       type: 'waveform', isHeld: false, row: 1, column: -4, colour: ''}, 
  'w': {htmlTitle: 'triangle',  function: 'triangle',   type: 'waveform', isHeld: false, row: 1, column: -3, colour: ''}, 
  'e': {htmlTitle: 'sawtooth',  function: 'sawtooth',   type: 'waveform', isHeld: false, row: 1, column: -2, colour: ''}, 
  'r': {htmlTitle: 'square',    function: 'square',     type: 'waveform', isHeld: false, row: 1, column: -1, colour: ''}, 

  's': {htmlTitle: 'C#',        function: '17.32',      type: 'baseFreq', isHeld: false, row: 2, column: -3, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'd': {htmlTitle: 'D#',        function: '19.45',      type: 'baseFreq', isHeld: false, row: 2, column: -2, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'g': {htmlTitle: 'F#',        function: '23.12',      type: 'baseFreq', isHeld: false, row: 2, column:  0, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'h': {htmlTitle: 'G#',        function: '25.96',      type: 'baseFreq', isHeld: false, row: 2, column:  1, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'j': {htmlTitle: 'A#',        function: '29.14',      type: 'baseFreq', isHeld: false, row: 2, column:  2, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 

  'z': {htmlTitle: 'C',         function: '16.35',      type: 'baseFreq', isHeld: false, row: 3, column: -3, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'x': {htmlTitle: 'D',         function: '18.35',      type: 'baseFreq', isHeld: false, row: 3, column: -2, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'c': {htmlTitle: 'E',         function: '20.60',      type: 'baseFreq', isHeld: false, row: 3, column: -1, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'v': {htmlTitle: 'F',         function: '21.83',      type: 'baseFreq', isHeld: false, row: 3, column:  0, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  'b': {htmlTitle: 'G',         function: '24.50',      type: 'baseFreq', isHeld: false, row: 3, column:  1, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}},
  'n': {htmlTitle: 'A',         function: '27.50',      type: 'baseFreq', isHeld: false, row: 3, column:  2, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}},
  'm': {htmlTitle: 'B',         function: '30.87',      type: 'baseFreq', isHeld: false, row: 3, column:  3, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}, 
  ',': {htmlTitle: 'C',         function: '32.70',      type: 'baseFreq', isHeld: false, row: 3, column:  4, colour: '', nodes: {'sine': [], 'triangle': [], 'sawtooth': [], 'square': []}}
}

export const nodeAttributes = ['baseFreq', 'waveform', 'octave']