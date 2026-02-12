import { useEffect, useRef, useState } from 'react';
import { play, stop, changeAttribute } from '../synth/Synth';
import './keyboard.css'

interface keyCodes {
  notes       : { [key: string]: number[] },
  waveShapes  : { [key: number]: string },
  octaves     : number[],
}

interface CustomTouchEvent extends TouchEvent {
  keyCode: number
}

export default function Keyboard() {

  const keyCodes: keyCodes = {
    notes : {
      'C' : [90, 6],  'C#': [83, 1],  'D' : [88, 7],  'D#': [68, 2], 
      'E' : [67, 8],  'F' : [86, 9],  'F#': [71, 5],  'G' : [66, 11], 
      'G#': [72, 4],  'A' : [78, 45], 'A#': [74, 38], 'B' : [77, 46], 
      'C+': [188, 44]
    },
    octaves : [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48],
    waveShapes   :  { 
      81: 'sine',
      87: 'triangle',
      69: 'sawtooth', 
      82: 'square'
    }
  }

  const [playingNotes, setPlayingNotes] = useState<number[]>([])
  const playingNotesRef = useRef(playingNotes)  

  useEffect(() => {  
    playingNotesRef.current = playingNotes  
  }, [playingNotes]) 
  
  function handleNoteStart(e: CustomTouchEvent) {

    if (Object.values(keyCodes.notes).flat().includes(e.keyCode) && !playingNotesRef.current.includes(e.keyCode)) {
      setPlayingNotes([...playingNotesRef.current, e.keyCode])

      const noteToPlay = Object.entries(keyCodes.notes).filter(([_, codes]) => codes.includes(e.keyCode))[0][0]

      play(noteToPlay)
    }

    if (keyCodes.octaves.includes(e.keyCode)) {
      changeAttribute('octave', keyCodes.octaves.indexOf(e.keyCode))
    }

    if (e.keyCode in keyCodes.waveShapes) {
      changeAttribute('waveShape', keyCodes.waveShapes[e.keyCode])
    }
  }

  function handleNoteEnd(e: CustomTouchEvent) {
    
    if (playingNotesRef.current.includes(e.keyCode)) {
      setPlayingNotes(playingNotesRef.current.filter(note => note !== e.keyCode))
      
      const noteToStop = Object.entries(keyCodes.notes).filter(([_, codes]) => codes.includes(e.keyCode))[0][0]

      stop(noteToStop)
    }
  }

  const keys = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ''],
    ['Q', 'W', 'E', 'R',  '',  '',  '',  '',  ''              ],
    ['S', 'D',  '', 'G', 'H', 'J',  ''                        ],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ','                   ]
  ] 

  useEffect(() => {  
    document.addEventListener('keydown', handleNoteStart as EventListener);  
    document.addEventListener('keyup', handleNoteEnd as EventListener);  
    document.addEventListener('touchstart', handleNoteStart as EventListener);  
    document.addEventListener('touchend', handleNoteEnd as EventListener);  
      
    return () => {  
      document.removeEventListener('keydown', handleNoteStart as EventListener);  
      document.removeEventListener('keyup', handleNoteEnd as EventListener);  
      document.removeEventListener('touchstart', handleNoteStart as EventListener);  
      document.removeEventListener('touchend', handleNoteEnd as EventListener);  
    };  
  }, []);

  return (
    <div id="keyboard">
      {keys.map((row: string[]) => 
        <div className="keyboard-row">
          {
            row.map((key: string, i: number) => {
              console.log(playingNotes)
              return <>
                <span className={`circle-outer${!key ? ' invisible' : ''}`} style={
                  // playingNotes.includes(key) ? 
                  {background: 'red'} 
                  //  : {}
                  }>
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
