import { useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import { keys } from '../data'
import { CustomTouchEvent } from './types';
import { randomColour, keyStyle, generateKeyColours } from './functions';
import { nodeAttribute, settingsAttribute } from '../synth/types';
import { keySize, rowOffset } from './data';
import './Keyboard.css'

// set up button colours

generateKeyColours(synth, keys)

// functions

const isKey = (key: string) => {
  return Object.keys(keys).includes(key)
}

const isNote = (key: string) => {
  return keys[key].type === 'baseFreq'
}

export const isActive = (key: string) => {
  return synth.settings.attributes[
    `${keys[key].type}s` as settingsAttribute
  ]?.includes(keys[key].function as string)
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

    const startHold = (key: string) => {
      if (isKey(key) && !isHeld(key)) {

        synth!.resume?.()
        
        synth.toggleAttribute(
          keys[key].type as nodeAttribute, 
          keys[key].function as string
        )

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
      e.preventDefault()
      const key = (e.target as HTMLElement).dataset.key
      if (!key) return      
      startHold(key)
    } 

    const handleTouchEnd = (e: CustomTouchEvent) => {
      e.preventDefault()
      const key = (e.target as HTMLElement).dataset.key
      if (!key) return
      endHold(key)
    }

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }


    // attach event listeners

    document.addEventListener     ('keydown'    , handleKeyDown     as EventListener);  
    document.addEventListener     ('keyup'      , handleKeyUp       as EventListener);  
    document.addEventListener     ('touchstart' , handleTouchStart  as EventListener, { passive: false });  
    document.addEventListener     ('touchend'   , handleTouchEnd    as EventListener, { passive: false });  
    document.addEventListener     ('touchmove'  , preventZoom       as EventListener, { passive: false });

    return () => {  
      document.removeEventListener('keydown'    , handleKeyDown     as EventListener);  
      document.removeEventListener('keyup'      , handleKeyUp       as EventListener);  
      document.removeEventListener('touchstart' , handleTouchStart  as EventListener);  
      document.removeEventListener('touchend'   , handleTouchEnd    as EventListener);
      document.removeEventListener('touchmove'  , preventZoom       as EventListener);
    };  
  }, []);


  return (
    <div id="keyboard-container">
      <div id="keyboard-inner">
        {
          Object.keys(keys).map((keyName: string) => {

            const style = keyStyle(keySize, rowOffset, keys, keyName)
            const title = keys[keyName].touchTitle || keys[keyName].htmlTitle 

            return <span
              data-key  = {keyName}
              key       = {keyName}  
              className = "key" 
              style     = {style}
              title     = {title}
            >
              <span className="computer text">{keyName}</span>
              <span className="touchscreen text">{title}</span>
            </span>
          })
        }
      </div>
    </div>
  )
}
