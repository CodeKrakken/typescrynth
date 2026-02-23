import { useCallback, useEffect, useRef, useState } from 'react';
import { Synth } from '../synth/Synth';
import './keyboard.css'
import { keys, keyCodes } from './data'
import { CustomTouchEvent, keyType } from './types';

export default function Keyboard() {

  const synthRef = useRef<ReturnType<typeof Synth> | null>(null)

  if (!synthRef.current) {
    synthRef.current = Synth()
  }

  const synth = synthRef.current

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys
  }, [heldKeys]) 
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {

    if (e.repeat) return

    synth!.resume?.()

    if (Object.keys(keyCodes.notes).includes(e.key) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])

      const noteToPlay = keyCodes.notes[e.key]
      synth.play(noteToPlay)
    }

    if (keyCodes.octaves.includes(e.keyCode) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])
      synth.changeAttribute('octave', keyCodes.octaves.indexOf(e.keyCode))
    }

    if (e.keyCode in keyCodes.waveShapes && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])
      synth.changeAttribute('waveShape', keyCodes.waveShapes[e.keyCode])
    }
  }, [synth])

  const handleKeyUp = useCallback((e: CustomTouchEvent) => {
    setHeldKeys(heldKeys => heldKeys.filter(key => key !== e.key))      
    
    if (Object.keys(keyCodes.notes).includes(e.key) && heldKeysRef.current.includes(e.key)) {

      const noteToStop = keyCodes.notes[e.key]
      synth.stop(noteToStop)
    }
  }, [synth])

  function randomColour() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const a = Math.floor(Math.random() * 11)/10

    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  useEffect(() => {  
      // keyboard interactions
    document.addEventListener     ('keydown',     handleKeyDown as EventListener);  
    document.addEventListener     ('keyup',       handleKeyUp   as EventListener);  
      // touchscreen interactions
    document.addEventListener     ('touchstart',  handleKeyDown as EventListener);  
    document.addEventListener     ('touchend',    handleKeyUp   as EventListener);  
      
    return () => {  
        // keyboard interactions
      document.removeEventListener('keydown',     handleKeyDown as EventListener);  
      document.removeEventListener('keyup',       handleKeyUp   as EventListener);  
        // touchscreen interactions
      document.removeEventListener('touchstart',  handleKeyDown as EventListener);  
      document.removeEventListener('touchend',    handleKeyUp   as EventListener);  
    };  
  }, [handleKeyUp, handleKeyDown]);

  return (
    <div id="keyboard">
      {Object.keys(keys).map((rowKey: string) => 
        <div className="keyboard-row">
          {rowKey}
          {
            keys[rowKey].map((key: keyType) => {
              return <>
                <span 
                  className={`circle-outer${!key.label ? ' invisible' : ''}`} 
                  style={heldKeys.includes(key.label) ? {background: randomColour()} : {}}
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
      )}
    </div>
  )
}
