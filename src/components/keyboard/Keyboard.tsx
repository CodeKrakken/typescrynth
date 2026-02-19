import { useCallback, useEffect, useRef, useState } from 'react';
import { Synth } from '../synth/Synth';
import './keyboard.css'

interface keyCodesInterface {
  notes       : { [key: string]: string },
  waveShapes  : { [key: number]: string },
  octaves     : number[],
}

interface CustomTouchEvent extends TouchEvent {
  key: string
  keyCode: number
}

const keyCodes: keyCodesInterface = {
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

export default function Keyboard() {

  const synthRef = useRef<ReturnType<typeof Synth> | null>(null)

  if (!synthRef.current) {
    synthRef.current = Synth()
  }

  const synth = synthRef.current

  const keys: {[key: string]: {label: string, key: string, function?: string}[]} = {
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

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys  
  }, [heldKeys]) 
  
  const handleNoteStart = useCallback((e: KeyboardEvent) => {

    if (e.repeat) return
    synth!.resume?.()

    if (Object.keys(keyCodes.notes).includes(e.key) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])

      const noteToPlay = keyCodes.notes[e.key]
      synth.play(noteToPlay)
    }

    if (keyCodes.octaves.includes(e.keyCode) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])
      synth.changeAttribute('octave', keyCodes.octaves.indexOf(e.keyCode))
    }

    if (e.keyCode in keyCodes.waveShapes && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])
      synth.changeAttribute('waveShape', keyCodes.waveShapes[e.keyCode])
    }
  }, [synth])

  const handleNoteEnd = useCallback((e: CustomTouchEvent) => {
    setHeldKeys(heldKeys => heldKeys.filter(note => note !== e.key))      
    
    if (Object.keys(keyCodes.notes).includes(e.key) && heldKeysRef.current.includes(e.key)) {

      const noteToStop = keyCodes.notes[e.key]
      synth.stop(noteToStop)
    }
  }, [synth])

  function randomColour() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const a = Math.floor(Math.random() * 11)/10

    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  useEffect(() => {  
      // keyboard interactions
    document.addEventListener     ('keydown',     handleNoteStart as EventListener);  
    document.addEventListener     ('keyup',       handleNoteEnd   as EventListener);  
      // touchscreen interactions
    document.addEventListener     ('touchstart',  handleNoteStart as EventListener);  
    document.addEventListener     ('touchend',    handleNoteEnd   as EventListener);  
      
    return () => {  
        // keyboard interactions
      document.removeEventListener('keydown',     handleNoteStart as EventListener);  
      document.removeEventListener('keyup',       handleNoteEnd   as EventListener);  
        // touchscreen interactions
      document.removeEventListener('touchstart',  handleNoteStart as EventListener);  
      document.removeEventListener('touchend',    handleNoteEnd   as EventListener);  
    };  
  }, [handleNoteEnd, handleNoteStart]);

  return (
    <div id="keyboard">
      {Object.keys(keys).map((rowKey: string) => 
        <div className="keyboard-row">
          {rowKey}
          {
            keys[rowKey].map((key: {key: string, label: string, function?: string}) => {
              return <>
                <span 
                  className={`circle-outer${!key.label ? ' invisible' : ''}`} 
                  style={heldKeys.includes(key.label) ? {background: randomColour()} : {}}
                  title={key.function}
                >
                  <span className="circle-inner">
                    {key.label}
                  </span>
                </span>
              </>
            })
          }
        </div>
      )}
    </div>
  )
}
