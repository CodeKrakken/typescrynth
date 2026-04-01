import { useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import { keys } from '../data'
import { CustomTouchEvent } from './types';
import { randomColour, keyStyle, generateKeyColours } from './functions';
import './keyboard.css'
import { nodeAttribute, settingsAttribute } from '../synth/types';
import { keySize, rowOffset } from './data';

// set up button colours

generateKeyColours(synth, keys)

// functions

const isKey = (key: string) => {
  return Object.keys(keys).includes(key)
}

const isNote = (key: string) => {
  return keys[key].type === 'baseFreq'
}


export default function Keyboard() {

  // set up state

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys
  }, [heldKeys])

  // set up event listeners and handlers

  useEffect(() => {

    // functions

    const isHeld = (key: string) => {
      return heldKeysRef.current.includes(key)
    }

    const isActive = (key: string) => {
      return synth.settings.attributes[`${keys[key].type}s` as settingsAttribute]?.includes(keys[key].function as string)
    }

    const startHold = (key: string) => {
      if (isKey(key) && !isHeld(key)) {

        synth!.resume?.()
        synth.toggleAttribute(keys[key].type as nodeAttribute, keys[key].function as string)

        if (isNote(key) || isActive(key))  { 
          keys[key].colour = randomColour() 
        } else { 
          keys[key].colour = '' 
        }

        setHeldKeys([...heldKeysRef.current, key])
      }
    }


    const endHold = (key: string) => {
        if (isHeld(key) && isNote(key)) {

        synth.toggleAttribute('baseFreq', keys[key].function as string);
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

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      endHold(key)
    }

    const handleTouchStart = (e: CustomTouchEvent) => {
    const key = (e.target as HTMLElement).dataset.key
    if (!key) return      
    startHold(key)
    } 

    const handleTouchEnd = (e: CustomTouchEvent) => {
      const key = (e.target as HTMLElement).dataset.key
      if (!key) return
      endHold(key)
    }


    // attach event listeners

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
  }, []);


  return (
    <div id="keyboard-container">
      <div id="keyboard-inner">
        {
          Object.keys(keys).map((keyName: string) => {

            const style = keyStyle(keySize, rowOffset, keys, keyName)
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
