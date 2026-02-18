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

  const keys: {[key: string]: {label: string}[]} = {
    octaves:      [{label: '`'}, {label: '1'}, {label: '2'}, {label: '3'}, {label: '4'}, {label: '5'}, {label: '6'}, {label: '7'}, {label: '8'}, {label: '9'}, {label: '0'}, {label: ''}],
    tones:        [{label: 'q'}, {label: 'w'}, {label: 'e'}, {label: 'r'}, {label: ''},  {label: ''},  {label: ''},  {label: ''},  {label: ''}],
    'black keys': [{label: 's'}, {label: 'd'}, {label: ''},  {label: 'g'}, {label: 'h'}, {label: 'j'}, {label: ''}],
    'white keys': [{label: 'z'}, {label: 'x'}, {label: 'c'}, {label: 'v'}, {label: 'b'}, {label: 'n'}, {label: 'm'}, {label: ','}]
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
            keys[rowKey].map((key: {label: string}, i: number) => {
              return <>
                <span className={`circle-outer${!key.label ? ' invisible' : ''}`} style={heldKeys.includes(key.label) ? {background: randomColour()} : {}}
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
