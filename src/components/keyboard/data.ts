import { keysType } from './types'

export const keys: keysType = {
  octaves:      [
    {key: '`', label: '`', htmlTitle:  '0', function:  0}, 
    {key: '1', label: '1', htmlTitle:  '1', function:  1}, 
    {key: '2', label: '2', htmlTitle:  '2', function:  2}, 
    {key: '3', label: '3', htmlTitle:  '3', function:  3}, 
    {key: '4', label: '4', htmlTitle:  '4', function:  4}, 
    {key: '5', label: '5', htmlTitle:  '5', function:  5}, 
    {key: '6', label: '6', htmlTitle:  '6', function:  6}, 
    {key: '7', label: '7', htmlTitle:  '7', function:  7}, 
    {key: '8', label: '8', htmlTitle:  '8', function:  8}, 
    {key: '9', label: '9', htmlTitle:  '9', function:  9}, 
    {key: '0', label: '0', htmlTitle: '10', function: 10},
    {key: '-', label: ''}
  ],
  tones:        [
    {key: 'q', label: 'q', htmlTitle: 'sine'    , function: 'sine'}, 
    {key: 'w', label: 'w', htmlTitle: 'triangle', function: 'triangle'}, 
    {key: 'e', label: 'e', htmlTitle: 'sawtooth', function: 'sawtooth'}, 
    {key: 'r', label: 'r', htmlTitle: 'square'  , function: 'square'}, 
    {key: 't', label: ''},  
    {key: 'y', label: ''}, 
    {key: 'u', label: ''},  
    {key: 'i', label: ''},  
    {key: 'o', label: ''}
  ],
  'black keys': [
    {key: 's', label: 's', htmlTitle: 'C#', function: 'C#'}, 
    {key: 'd', label: 'd', htmlTitle: 'D#', function: 'D#'}, 
    {key: 'f', label: ''}, 
    {key: 'g', label: 'g', htmlTitle: 'F#', function: 'F#'}, 
    {key: 'h', label: 'h', htmlTitle: 'G#', function: 'G#'}, 
    {key: 'j', label: 'j', htmlTitle: 'A#', function: 'A#'}, 
    {key: 'k', label: ''}
  ],
  'white keys': [
    {key: 'z', label: 'z', htmlTitle: 'C', function: 'C'}, 
    {key: 'x', label: 'x', htmlTitle: 'D', function: 'D'}, 
    {key: 'c', label: 'c', htmlTitle: 'E', function: 'E'}, 
    {key: 'v', label: 'v', htmlTitle: 'F', function: 'F'}, 
    {key: 'b', label: 'b', htmlTitle: 'G', function: 'G'}, 
    {key: 'n', label: 'n', htmlTitle: 'A', function: 'A'}, 
    {key: 'm', label: 'm', htmlTitle: 'B', function: 'B'}, 
    {key: ',', label: ',', htmlTitle: 'C', function: 'C+'}
  ]
} 
