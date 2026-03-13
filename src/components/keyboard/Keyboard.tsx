import { useCallback, useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import './keyboard.css'
import { keys, keySize, rowOffset } from './data'
import { CustomTouchEvent, keyType } from './types';
import { randomColour, isEven, isHeld } from './functions';

export default function Keyboard() {



  // state setup

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys
  }, [heldKeys])



  // functions






  const keyPosition = (key: keyType) => {
    const x = key.column as number * keySize + (isEven(key.row as number) ? rowOffset : 0)
    const y = key.row as number * keySize

    return {
      transform: `translate(${x}px, ${y}px)`
    }
  }
  

  const backgroundColour = (key: string) => {
    return isHeld(key, heldKeys) ? {background: randomColour()} : {}
  }


  const keyStyle = (keyName: string) => {
    return {
      ...keyPosition(keys[keyName]), 
      ...backgroundColour(keyName)
    }
  }


  useEffect(() => {  

    const startHold = (key: string) => {
      if (!isHeld(key, heldKeys)) {
        synth!.resume?.()
        
        switch(keys[key].type) {
          case 'note':  synth.play(key); break
          case 'octave': synth.changeOctave(keys[key].function as number); break
          case 'waveform': synth.changeWaveform(keys[key].function as string); break
        }
        setHeldKeys([...heldKeysRef.current, key])
      }
    }


    const endHold = (key: string) => {
      if (isHeld(key, heldKeysRef.current)) {
        
        switch(keys[key].type) {
          case 'note':  synth.stop(key); break
          case 'octave': synth.changeOctave(keys[key].function as number); break
          case 'waveform': synth.changeWaveform(keys[key].function as string); break
        }
        setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== key))    
      }
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
    <div id="keyboard">
      {
        Object.keys(keys).map((keyName: string) => {
          return <span
            data-key={keyName} 
            className={`circle-outer key`} 
            style={keyStyle(keyName)}
            title={keys[keyName].htmlTitle}
          >
            <span className="circle-inner">
              {keyName}
            </span>
          </span>
        })
      }
    </div>
  )
}
