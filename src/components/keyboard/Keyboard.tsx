import { useCallback, useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import './keyboard.css'
import { keys } from '../data'
import { CustomTouchEvent } from './types';
import { randomColour, position } from './functions';
import { isNote } from '../functions';

synth.settings.octaves.forEach(octave => {
  keys[octave].colour = randomColour()
})

synth.settings.waveforms.forEach(waveform => {
  const key = Object.keys(keys).find(key => keys[key].function === waveform) as string
  keys[key].colour = randomColour()
})

export default function Keyboard() {


  // state setup

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys
  }, [heldKeys])



  // functions

  const isHeld = useCallback((key: string) => {
    return heldKeys.includes(key)
  }, [heldKeys])
  
  

  const backgroundColour = (key: string) => {
    if (keys[key].type === 'note') {
      return {background: keys[key].colour}
    } else if (keys[key].type === 'octave') {
      return synth.settings.octaves.includes(keys[key].function as number) ? {background: keys[key].colour} : {}
    } else if (keys[key].type === 'waveform') {
      return synth.settings.waveforms.includes(keys[key].function as string) ? {background: keys[key].colour} : {}
    }
  }


  const keyStyle = (keyName: string) => {
    return {
      ...position(keys[keyName]), 
      ...backgroundColour(keyName)
    }
  }

  const isKey = (key: string) => {
    return Object.keys(keys).includes(key)
  }

  const startHold = (key: string) => {
    if (isKey(key) && !isHeld(key)) {
      synth!.resume?.()
      
      switch(keys[key].type) {
        case 'note'     : synth.play(key); keys[key].colour = randomColour(); break
        case 'octave'   : synth.toggleOctave(keys[key].function as number); keys[key].colour = synth.settings.octaves.includes(keys[key].function as number) ? randomColour() : ''; break
        case 'waveform' : synth.toggleWaveform(keys[key].function as string); keys[key].colour = synth.settings.waveforms.includes(keys[key].function as string) ? randomColour() : ''; break
      }
        setHeldKeys([...heldKeysRef.current, key])
    }
  }


  const endHold = (key: string) => {
    if (isHeld(key) && isNote(key)) {
      synth.stop(key)
      keys[key].colour = ''
    }
    setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== key))
  
  }


  useEffect(() => {


    
    // event handlers

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      startHold(key)
    }


    const handleTouchStart = (e: CustomTouchEvent) => {
      const key = (e.target as HTMLElement).innerText.toLowerCase()
      startHold(key)
    }


    const handleKeyUp = (e: KeyboardEvent) => {
      const releasedKey = e.key.toLowerCase()
      endHold(releasedKey)
    }
        

    const handleTouchEnd = (e: CustomTouchEvent) => {
      const releasedKey = (e.target as HTMLElement).innerText.toLowerCase()
      endHold(releasedKey)
    }

    // event listeners

    document.addEventListener     ('keydown'    , handleKeyDown     as EventListener);  
    document.addEventListener     ('keyup'      , handleKeyUp       as EventListener);  
    document.addEventListener     ('touchstart' , handleTouchStart  as EventListener);  
    document.addEventListener     ('touchend'   , handleTouchEnd    as EventListener);  
      
    return () => {  
      document.removeEventListener('keydown'    , handleKeyDown     as EventListener);  
      document.removeEventListener('keyup'      , handleKeyUp       as EventListener);  
      document.removeEventListener('touchstart' , handleTouchStart  as EventListener);  
      document.removeEventListener('touchend'   , handleTouchEnd    as EventListener);  
    };  
  }, [isHeld]);



  return (
    <div id="keyboard-container">
      <div id="keyboard-inner">
        {
          Object.keys(keys).map((keyName: string) => {
            return <span
              data-key={keyName} 
              className="key" 
              style={keyStyle(keyName)}
              title={keys[keyName].htmlTitle}
            >
              <span className="text">
                {keyName}
              </span>
            </span>
          })
        }
      </div>
    </div>
  )
}
