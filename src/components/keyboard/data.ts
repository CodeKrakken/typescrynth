import { keysType } from './types'

export const keys: keysType = {
  octaves:      [
    {key: '`', label: '`', function: '0'}, 
    {key: '1', label: '1', function: '1'}, 
    {key: '2', label: '2', function: '2'}, 
    {key: '3', label: '3', function: '3'}, 
    {key: '4', label: '4', function: '4'}, 
    {key: '5', label: '5', function: '5'}, 
    {key: '6', label: '6', function: '6'}, 
    {key: '7', label: '7', function: '7'}, 
    {key: '8', label: '8', function: '8'}, 
    {key: '9', label: '9', function: '9'}, 
    {key: '0', label: '0', function: '10'}, 
    {key: '-', label: ''}
  ],
  tones:        [
    {key: 'q', label: 'q', function: 'sine'}, 
    {key: 'w', label: 'w', function: 'triangle'}, 
    {key: 'e', label: 'e', function: 'sawtooth'}, 
    {key: 'r', label: 'r', function: 'square'}, 
    {key: 't', label: ''},  
    {key: 'y', label: ''}, 
    {key: 'u', label: ''},  
    {key: 'i', label: ''},  
    {key: 'o', label: ''}
  ],
  'black keys': [
    {key: 's', label: 's', function: 'C#'}, 
    {key: 'd', label: 'd', function: 'D#'}, 
    {key: 'f', label: ''}, 
    {key: 'g', label: 'g', function: 'F#'}, 
    {key: 'h', label: 'h', function: 'G#'}, 
    {key: 'j', label: 'j', function: 'A#'}, 
    {key: 'k', label: ''}
  ],
  'white keys': [
    {key: 'z', label: 'z', function: 'C'}, 
    {key: 'x', label: 'x', function: 'D'}, 
    {key: 'c', label: 'c', function: 'E'}, 
    {key: 'v', label: 'v', function: 'F'}, 
    {key: 'b', label: 'b', function: 'G'}, 
    {key: 'n', label: 'n', function: 'A'}, 
    {key: 'm', label: 'm', function: 'B'}, 
    {key: ',', label: ',', function: 'C'}]
} 