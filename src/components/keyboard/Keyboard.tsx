import { useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import './keyboard.css'
import { keys } from '../data'
import { CustomTouchEvent } from './types';
import { randomColour, position } from './functions';
import { isNote } from '../functions';

// Set up button colours

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

  const keyStyle = (keyName: string) => {
    return {
      ...position(keys[keyName]), 
      // ...backgroundColour(keyName)
      background: keys[keyName].colour
    }
  }

  const isKey = (key: string) => {
    return Object.keys(keys).includes(key)
  }

  


  useEffect(() => {

    const startHold = (key: string) => {
      if (isKey(key) && !heldKeys.includes(key)) {
        synth!.resume?.()
        
        switch(keys[key].type) {
          case 'note'     : synth.startNote(key); keys[key].colour = randomColour(); break
          case 'octave'   : {
            synth.toggleOctave(keys[key].function as number); 
            keys[key].colour = synth.settings.octaves.includes(keys[key].function as number) ? randomColour() : ''; 
            break
          }
          case 'waveform' : {
            synth.toggleWaveform(keys[key].function as string); 
            keys[key].colour = synth.settings.waveforms.includes(keys[key].function as string) ? randomColour() : ''; 
            break
          }
        }
        setHeldKeys([...heldKeysRef.current, key])
      }
    }


    const endHold = (key: string) => {
      if (heldKeys.includes(key) && isNote(key)) {
        synth.stopNote(key)
        keys[key].colour = ''
      }
      setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== key))
    
    }


    
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
      const key = e.key.toLowerCase()
      endHold(key)
    }
        

    const handleTouchEnd = (e: CustomTouchEvent) => {
      const key = (e.target as HTMLElement).innerText.toLowerCase()
      endHold(key)
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
  }, [heldKeys]);



  return (
    <div id="keyboard-container">
      <div id="keyboard-inner">
        {
          Object.keys(keys).map((keyName: string) => {

            const style = keyStyle(keyName)
            const title = keys[keyName].htmlTitle

            return <span
              data-key  = {keyName} 
              className = "key" 
              style     = {style}
              title     = {title}
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
