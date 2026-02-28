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
  
  const isNote = (key: string) => {
    const notes = noteKeys().map(note => note.function && note.key)
    return notes.includes(key) 
  }

  const noteKeys = () => {
    return [keys['black keys'], keys['white keys']].flat()
  }

  const isOctave = (key: string) => {
    return keys.octaves.filter(octave => octave.key === key)
  }

  const isWaveShape = (key: string) => {
    return keys.tones.filter(tone => tone.key === key)
  }

  const noteFrom = (key: string) => {
    return noteKeys().filter(note => note.key === key)[0].function as string
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {

    if (e.repeat) return

    synth!.resume?.()

    if (isNote(e.key) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])

      const noteToPlay = noteFrom(e.key)
      synth.play(noteToPlay as string)
    }

    if (isOctave(e.key) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])
      const newOctave = keys.octaves.filter(octave => octave.key === e.key)[0].function
      synth.changeAttribute('octave', newOctave as number)
    }

    if (isWaveShape(e.key) && !heldKeysRef.current.includes(e.key)) {
      setHeldKeys([...heldKeysRef.current, e.key])
      const newWaveShape = keys.tones.filter(waveShape => waveShape.key === e.key)[0].function
      synth.changeAttribute('waveShape', newWaveShape as string)
    }
  }, [synth])




  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setHeldKeys(heldKeys => heldKeys.filter(key => key !== e.key))      
    
    if (isNote(e.key) && heldKeysRef.current.includes(e.key)) {

      const noteToStop = noteFrom(e.key)
      synth.stop(noteToStop as string)
    }
  }, [synth])

  const handleTouchStart = useCallback((e: CustomTouchEvent) => {

    const heldKey = e.explicitOriginalTarget.innerText

    synth!.resume?.()

    if (isNote(heldKey) && !heldKeysRef.current.includes(heldKey)) {
      setHeldKeys([...heldKeysRef.current, heldKey])
      console.log(heldKey)
      const noteToPlay = noteFrom[heldKey]
      synth.play(noteToPlay as string)
    }

    if (keys.octaves.map(octave => octave.key).includes(heldKey) && !heldKeysRef.current.includes(heldKey)) {
      setHeldKeys([...heldKeysRef.current, heldKey])
      const newOctave = keys.octaves.filter((octave) => octave.key === heldKey)[0].function
      synth.changeAttribute('octave', newOctave as number)
    }

    if (keys.tones.map(tone => tone.key).includes(heldKey) && !heldKeysRef.current.includes(heldKey)) {
      setHeldKeys([...heldKeysRef.current, heldKey])
      const newWaveShape = keys.tones.filter((tone) => tone.key === heldKey)[0].function
      synth.changeAttribute('waveShape', newWaveShape as string)
    }
  }, [synth])
 



  const handleTouchEnd = useCallback((e: CustomTouchEvent) => {

    const releasedKey = e.explicitOriginalTarget.innerText
    
    setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== releasedKey))      
    
    if (Object.keys(keyCodes.notes).includes(releasedKey) && heldKeysRef.current.includes(releasedKey)) {

      const noteToStop = keyCodes.notes[releasedKey]
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
