import { useCallback, useEffect, useRef, useState } from 'react';
import { synth } from '../synth/Synth';
import './keyboard.css'
import { keys } from './data'
import { CustomTouchEvent, keyType } from './types';

export default function Keyboard() {

  const [heldKeys, setHeldKeys] = useState<string[]>([])
  const heldKeysRef = useRef(heldKeys)  

  useEffect(() => {  
    heldKeysRef.current = heldKeys
  }, [heldKeys])
  
  const noteKeys = useCallback(() => {
    return [keys['black keys'], keys['white keys']].flat()
  }, [])
  
  const isNote = useCallback((key: string) => {
    const notes = noteKeys().map(note => note.function && note.key)
    return notes.includes(key) 
  }, [noteKeys])

  const isOctave = (key: string) => {
    return keys.octaves.map(octave => octave.key).includes(key)
  }

  const iswaveform = (key: string) => {
    return keys.waveforms.map(waveform => waveform.key).includes(key)
  }

  const noteFrom = useCallback((key: string) => {
    return noteKeys().filter(note => note.key === key)[0].function as string
  }, [noteKeys])

  const isHeld = (key: string) => {
    return heldKeysRef.current.includes(key)
  }

  const octaveFrom = (key: string) => {
    return keys.octaves.filter(octave => octave.key === key)[0].function
  }

  const waveformFrom = (key: string) => {
    return keys.waveforms.filter(waveform => waveform.key === key)[0].function
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {

    if (e.repeat) return

    synth!.resume?.()

    const key = e.key.toLowerCase()

    if (isNote(key) && !isHeld(key)) {      
      const noteToPlay = noteFrom(key)
      synth.play(noteToPlay as string)
    }

    if (isOctave(key) && !isHeld(key)) {
      const newOctave = octaveFrom(key)
      synth.changeAttribute('octave', newOctave as number)
    }

    if (iswaveform(key) && !isHeld(key)) {
      const newwaveform = waveformFrom(key)
      synth.changeAttribute('waveform', newwaveform as string)
    }

    setHeldKeys([...heldKeysRef.current, key])

  }, [isNote, noteFrom])




  const handleKeyUp = useCallback((e: KeyboardEvent) => {

    const releasedKey = e.key.toLowerCase()
    
    if (isNote(releasedKey) && isHeld(releasedKey)) {

      const noteToStop = noteFrom(releasedKey)
      synth.stop(noteToStop as string)
    }

    setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== releasedKey))      

  }, [isNote, noteFrom])

  const handleTouchStart = useCallback((e: CustomTouchEvent) => {

    const heldKey = e.explicitOriginalTarget.innerText

    synth!.resume?.()

    if (isNote(heldKey) && !isHeld(heldKey)) {
      const noteToPlay = noteFrom(heldKey)
      synth.play(noteToPlay)
    }

    if (isOctave(heldKey) && !isHeld(heldKey)) {
      const newOctave = octaveFrom(heldKey)
      synth.changeAttribute('octave', newOctave as number)
    }

    if (iswaveform(heldKey) && !isHeld(heldKey)) {
      const newwaveform = waveformFrom(heldKey)
      synth.changeAttribute('waveform', newwaveform as string)
    }

    setHeldKeys([...heldKeysRef.current, heldKey])

  }, [isNote, noteFrom])
 



  const handleTouchEnd = useCallback((e: CustomTouchEvent) => {

    const releasedKey = e.explicitOriginalTarget.innerText
    
    if (isNote(releasedKey) && isHeld(releasedKey)) {
      const noteToStop = noteFrom(releasedKey)
      synth.stop(noteToStop)
    }
    
    setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== releasedKey))      

  }, [isNote, noteFrom])



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
    document.addEventListener     ('touchstart',  handleTouchStart as EventListener);  
    document.addEventListener     ('touchend',    handleTouchEnd   as EventListener);  
      
    return () => {  
        // keyboard interactions
      document.removeEventListener('keydown',     handleKeyDown as EventListener);  
      document.removeEventListener('keyup',       handleKeyUp   as EventListener);  
        // touchscreen interactions
      document.removeEventListener('touchstart',  handleTouchStart as EventListener);  
      document.removeEventListener('touchend',    handleTouchEnd   as EventListener);  
    };  
  }, [handleKeyUp, handleKeyDown, handleTouchStart, handleTouchEnd]);

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
        )
      }
    </div>
  )
}
