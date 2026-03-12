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
   

  const startHold = (key: string) => {
    if (!keys[key].isHeld) {
      keys[key].isHeld = true
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
    if (keys[key].isHeld) {
      keys[key].isHeld = false
      
      switch(keys[key].type) {
        case 'note':  synth.stop(key); break
        case 'octave': synth.changeOctave(keys[key].function as number); break
        case 'waveform': synth.changeWaveform(keys[key].function as string); break
      }
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
      startHold(key)
    }


    const handleTouchStart = (e: CustomTouchEvent) => {
      const key = e.explicitOriginalTarget.innerText
      startHold(key)
    }


    const handleKeyUp = (e: KeyboardEvent) => {
      const releasedKey = e.key.toLowerCase()
      endHold(releasedKey)
    }
        

    const handleTouchEnd = (e: CustomTouchEvent) => {
      const releasedKey = e.explicitOriginalTarget.innerText
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
