import { useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import './keyboard.css'
import { keys } from './data'
import { CustomTouchEvent, keyType } from './types';
import { randomColour, circleOuterClassName, isNote } from './functions';

export default function Keyboard() {

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys
  }, [heldKeys])

  // handler helpers
  
  const isHeld = (key: string) => {
    return heldKeysRef.current.includes(key)
  }

  const isFunctional = (key: string) => {
    const functionalKeys = Object.keys(keys)
    return functionalKeys.includes(key)
  }
  

  const activate = (key: string) => {
    if (!keys[key].isHeld) {
      keys[key].isHeld = true
      synth!.resume?.()
      synth.play(key)
      setHeldKeys([...heldKeysRef.current, key])
    }
  }


  const deactivate = (key: string) => {
    if (keys[key].isHeld) {
      keys[key].isHeld = false
      synth.stop(key)
      setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== key))    
    }
  }


  const backgroundColour = (key: keyType) => {
    return key.isHeld ? {background: randomColour()} : {}
  }


  useEffect(() => {  

    // event handlers

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      activate(key)
    }


    const handleTouchStart = (e: CustomTouchEvent) => {
      const key = e.explicitOriginalTarget.innerText
      activate(key)
    }


    const handleKeyUp = (e: KeyboardEvent) => {
      const releasedKey = e.key.toLowerCase()
      deactivate(releasedKey)
    }
        

    const handleTouchEnd = (e: CustomTouchEvent) => {
      const releasedKey = e.explicitOriginalTarget.innerText
      deactivate(releasedKey)
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
  });



  return (
    <div id="keyboard">
      {
        Object.keys(keys).map((key: string) => {
          return <span 
            className={circleOuterClassName(keys[key])} 
            style={backgroundColour(keys[key])}
            title={keys[key].htmlTitle}
          >
            <span className="circle-inner">
              {keys[key].label}
            </span>
          </span>
        })
      }
    </div>
  )
}
