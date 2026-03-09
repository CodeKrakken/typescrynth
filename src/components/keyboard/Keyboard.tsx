import { useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import './keyboard.css'
import { keys } from './data'
import { CustomTouchEvent, keyType } from './types';
import { functionFrom, noteFrom, octaveFrom, waveformFrom, randomColour, circleOuterClassName, isNote } from './functions';

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
  

  const activate = (key: string) => {

    if (!isHeld(key)) {

      synth!.resume?.()
      const keyFunction = functionFrom(key)

      switch(keyFunction) {
        case 'note'     :synth.play(noteFrom(key) as string)               ; break
        case 'octave'   :synth.changeOctave(octaveFrom(key) as number)     ; break
        case 'waveform' :synth.changeWaveform(waveformFrom(key) as string) ; break
        default: break
      }

      setHeldKeys([...heldKeysRef.current, key])
    }
  }


  const deactivate = (key: string) => {
    if (isHeld(key) && isNote(key)) {
        const noteToStop = noteFrom(key)
        synth.stop(noteToStop as string)
      }
      setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== key))      
  }


  const backgroundColour = (key: keyType) => {
    return heldKeys.includes(key.label) ? {background: randomColour()} : {}
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
        Object.keys(keys).map((rowKey: string) => 
          <div className="keyboard-row">
            {rowKey}

            {
              keys[rowKey].map((key: keyType) => {

                return <>
                  <span 
                    className={circleOuterClassName(key)} 
                    style={backgroundColour(key)}
                    title={key.htmlTitle}
                  >
                    <span className="circle-inner">
                      {key.label}
                    </span>
                    
                  </span>
                </>
              })
            }
          </div>
        )
      }
    </div>
  )
}
