import { useCallback, useEffect, useRef, useState } from 'react';
import { Synth } from '../synth/Synth';
import './keyboard.css'

interface keyCodes {
  notes       : { [key: string]: string },
  waveShapes  : { [key: number]: string },
  octaves     : number[],
}

interface CustomTouchEvent extends TouchEvent {
  key: string
  keyCode: number
}

export default function Keyboard() {

  const synthRef = useRef<ReturnType<typeof Synth> | null>(null)

  if (!synthRef.current) {
    synthRef.current = Synth()
  }

  const synth = synthRef.current

  const keyCodes: keyCodes = {
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

  const keys = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ''],
    ['q', 'w', 'e', 'r',  '',  '',  '',  '',  ''              ],
    ['s', 'd',  '', 'g', 'h', 'j',  ''                        ],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ','                   ]
  ] 

  const [playingNotes, setPlayingNotes] = useState<string[]>([])
  const playingNotesRef = useRef(playingNotes)  

  useEffect(() => {  
    playingNotesRef.current = playingNotes  
  }, [playingNotes]) 
  
  const handleNoteStart = useCallback((e: KeyboardEvent) => {

    if (e.repeat) return
    synth!.resume?.()

    if (Object.keys(keyCodes.notes).includes(e.key) && !playingNotesRef.current.includes(e.key)) {
      setPlayingNotes([...playingNotesRef.current, e.key])

      const noteToPlay = keyCodes.notes[e.key]
      synth.play(noteToPlay)
    }

    if (keyCodes.octaves.includes(e.keyCode)) {
      synth.changeAttribute('octave', keyCodes.octaves.indexOf(e.keyCode))
    }

    if (e.keyCode in keyCodes.waveShapes) {
      synth.changeAttribute('waveShape', keyCodes.waveShapes[e.keyCode])
    }
  }, [keyCodes, synth])

  const handleNoteEnd = useCallback((e: CustomTouchEvent) => {
    
    if (playingNotesRef.current.includes(e.key)) {
      setPlayingNotes(playingNotes => playingNotes.filter(note => note !== e.key))      

      const noteToStop = keyCodes.notes[e.key]

      synth.stop(noteToStop)
    }
  }, [keyCodes, synth])

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
      {keys.map((row: string[]) => 
        <div className="keyboard-row">
          {
            row.map((key: string, i: number) => {
              return <>
                <span className={`circle-outer${!key ? ' invisible' : ''}`} style={playingNotes.includes(key) ? {background: randomColour()} : {}}
                  >
                  <span className="circle-inner">
                    {key}
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
