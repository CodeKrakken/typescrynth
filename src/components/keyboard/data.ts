import { keysType, keyCodesInterface } from './types'

export const keys: keysType = {
  octaves:      [
    {key: '`', label: '`', htmlTitle: '0'}, 
    {key: '1', label: '1', htmlTitle: '1'}, 
    {key: '2', label: '2', htmlTitle: '2'}, 
    {key: '3', label: '3', htmlTitle: '3'}, 
    {key: '4', label: '4', htmlTitle: '4'}, 
    {key: '5', label: '5', htmlTitle: '5'}, 
    {key: '6', label: '6', htmlTitle: '6'}, 
    {key: '7', label: '7', htmlTitle: '7'}, 
    {key: '8', label: '8', htmlTitle: '8'}, 
    {key: '9', label: '9', htmlTitle: '9'}, 
    {key: '0', label: '0', htmlTitle: '10'}, 
    {key: '-', label: ''}
  ],
  tones:        [
    {key: 'q', label: 'q', htmlTitle: 'sine'}, 
    {key: 'w', label: 'w', htmlTitle: 'triangle'}, 
    {key: 'e', label: 'e', htmlTitle: 'sawtooth'}, 
    {key: 'r', label: 'r', htmlTitle: 'square'}, 
    {key: 't', label: ''},  
    {key: 'y', label: ''}, 
    {key: 'u', label: ''},  
    {key: 'i', label: ''},  
    {key: 'o', label: ''}
  ],
  'black keys': [
    {key: 's', label: 's', htmlTitle: 'C#'}, 
    {key: 'd', label: 'd', htmlTitle: 'D#'}, 
    {key: 'f', label: ''}, 
    {key: 'g', label: 'g', htmlTitle: 'F#'}, 
    {key: 'h', label: 'h', htmlTitle: 'G#'}, 
    {key: 'j', label: 'j', htmlTitle: 'A#'}, 
    {key: 'k', label: ''}
  ],
  'white keys': [
    {key: 'z', label: 'z', htmlTitle: 'C'}, 
    {key: 'x', label: 'x', htmlTitle: 'D'}, 
    {key: 'c', label: 'c', htmlTitle: 'E'}, 
    {key: 'v', label: 'v', htmlTitle: 'F'}, 
    {key: 'b', label: 'b', htmlTitle: 'G'}, 
    {key: 'n', label: 'n', htmlTitle: 'A'}, 
    {key: 'm', label: 'm', htmlTitle: 'B'}, 
    {key: ',', label: ',', htmlTitle: 'C'}]
} 

export const keyCodes: keyCodesInterface = {
  notes : {
    z   : 'C' , s: 'C#' , x:  'D' , d : 'D#', 
    c   : 'E' , v: 'F'  , g:  'F#', b : 'G' , 
    h   : 'G#', n: 'A'  , j:  'A#', m : 'B' , 
    ',' : 'C+'
  },
  octaves : [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48],
  waveShapes   :  { 
    81: 'sine',
    87: 'triangle',
    69: 'sawtooth', 
    82: 'square'
  }
}