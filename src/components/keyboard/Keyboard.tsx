import { useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import { keys } from '../data'
import { CustomTouchEvent } from './types';
import { randomColour, position } from './functions';
import { isNote } from '../functions';
import './keyboard.css'
import { nodeAttribute } from '../synth/types';

// Set up button colours

synth.settings.attributes.octaves.forEach(octave => {
  keys[octave].colour = randomColour()
})

synth.settings.attributes.waveforms.forEach(waveform => {
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
      background: keys[keyName].colour
    }
  }


  useEffect(() => {

    const startHold = (key: string) => {
      if (!heldKeys.includes(key)) {

        try {
          synth!.resume?.()
        
          switch(keys[key].type) {
            case 'noteKey'     : synth.toggleAttribute('noteKey', key); keys[key].colour = randomColour(); break
            default: {
              synth.toggleAttribute(keys[key].type as nodeAttribute, keys[key].function as string); 
              keys[key].colour = synth.settings.attributes[`${keys[key].type}s` as keyof typeof synth.settings.attributes]?.includes(keys[key].function as string) ? randomColour() : ''; 
              break
            }
          }
          setHeldKeys([...heldKeysRef.current, key])
        } catch (error) {
          console.log(key)
        }
      }
    }


    const endHold = (key: string) => {
      if (heldKeys.includes(key) && isNote(key)) {
        synth.toggleAttribute('noteKey', key);
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
