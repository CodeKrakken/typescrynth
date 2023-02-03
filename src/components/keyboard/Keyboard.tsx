import { play, stop, changeAttribute } from '../synth/Synth';
import './keyboard.css'

interface keyCodes {
  notes:      { [key: number]: string },
  waveShapes: { [key: number]: string },
  octaves:    number[],
}

interface e {
  keyCode: number
}

interface CustomTouchEvent extends TouchEvent {
  keyCode: number
}

export default function Keyboard() {

  const keyCodes: keyCodes = {
    notes   : {
      90 : 'C' ,  6: 'C' ,  83 : 'C#',  1: 'C#',
      88 : 'D' ,  7: 'D' ,  68 : 'D#',  2: 'D#',
      67 : 'E' ,  8: 'E' ,  86 : 'F' ,  9: 'F' ,
      71 : 'F#',  5: 'F#',  66 : 'G' , 11: 'G' ,
      72 : 'G#',  4: 'G#',  78 : 'A' , 45: 'A' ,
      74 : 'A#', 38: 'A#',  77 : 'B' , 46: 'B' ,
     188 : 'C+', 43: 'C+'    
    },
    octaves : [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48],
    waveShapes   :  { 
      81: 'sine',
      87: 'triangle',
      69: 'sawtooth', 
      82: 'square'
    }
  }
  
  let playingNotes: number[] = []

  function handleNoteStart(e: CustomTouchEvent) {
    
    if (e.keyCode in keyCodes.notes && !playingNotes.includes(e.keyCode)) {
      playingNotes.push(e.keyCode)
      play(keyCodes.notes[e.keyCode])
    }

    if (keyCodes.octaves.includes(e.keyCode)) {
      changeAttribute('octave', keyCodes.octaves.indexOf(e.keyCode))
    }

    if (e.keyCode in keyCodes.waveShapes) {
      changeAttribute('waveShape', keyCodes.waveShapes[e.keyCode])
    }
  }

  function handleNoteEnd(e: CustomTouchEvent) {
    if (playingNotes.includes(e.keyCode)) {
      playingNotes = playingNotes.filter(note => note !== e.keyCode)
      stop(keyCodes.notes[e.keyCode])
    }
  }

  document.addEventListener('keydown'   , handleNoteStart as EventListener);
  document.addEventListener('keyup'     , handleNoteEnd   as EventListener);
  document.addEventListener('touchstart', handleNoteStart as EventListener);
  document.addEventListener('touchend'  , handleNoteEnd   as EventListener);

  const keys = [
    ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, '0', ''],
    ['Q', 'W', 'E', 'R', '', '', '', '', ''],
    ['S', 'D', '', 'G', 'H', 'J', ''],
    ['Z','X','C','V','B','N','M', ',']
  ] 

  return (
    <div id="keyboard">
      {keys.map(row => 
        <div className="keyboard-row">
          {
            row.map((key, i) => 
              <span className={`circle-outer${!key ? ' invisible' : ''}`}>
                <span className="circle-inner">
                  {key}
                </span>
              </span>
            )
          }
        </div>
      )}
    </div>
  )
}
