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


  // handler helpers
  
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


  const isWaveform = (key: string) => {
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

  
  const functionFrom = (key: string) => {

    let keyFunction: string = ''
    
    if (isNote(key)) {
      keyFunction = 'note'
    } else if (isOctave(key)) {
      keyFunction = 'octave'
    } else if (isWaveform(key)) {
      keyFunction = 'waveform'
    }

    return keyFunction
  }

  const activate = (key: string, keyFunction: string) => {

    if (!isHeld(key)) {

      switch(keyFunction) {
        case 'note':
          const noteToPlay = noteFrom(key)
          synth.play(noteToPlay as string)
          break
        case 'octave':
          const newOctave = octaveFrom(key)
          synth.changeAttribute('octave', newOctave as number)
          break
        case 'waveform':
          const newWaveform = waveformFrom(key)
          synth.changeAttribute('waveform', newWaveform as string)
          break
        default: break
      }
    }
  }

  
  // Event handlers

  const handleKeyDown = useCallback((e: KeyboardEvent) => {

    if (e.repeat) return
    synth!.resume?.()
    const key = e.key.toLowerCase()
    const keyFunction = functionFrom(key)
    activate(key, keyFunction)
    setHeldKeys([...heldKeysRef.current, key])

  }, [isNote, noteFrom])




  const handleKeyUp = useCallback((e: KeyboardEvent) => {

    const releasedKey = e.key.toLowerCase()
    
    if (isHeld(releasedKey) && isNote(releasedKey)) {

      const noteToStop = noteFrom(releasedKey)
      synth.stop(noteToStop as string)
    }

    setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== releasedKey))      

  }, [isNote, noteFrom])



  const handleTouchStart = useCallback((e: CustomTouchEvent) => {

    const heldKey = e.explicitOriginalTarget.innerText

    synth!.resume?.()

    if (!isHeld(heldKey) && isNote(heldKey)) {
      const noteToPlay = noteFrom(heldKey)
      synth.play(noteToPlay)
    }

    if (!isHeld(heldKey) && isOctave(heldKey)) {
      const newOctave = octaveFrom(heldKey)
      synth.changeAttribute('octave', newOctave as number)
    }

    if (!isHeld(heldKey) && isWaveform(heldKey)) {
      const newWaveform = waveformFrom(heldKey)
      synth.changeAttribute('waveform', newWaveform as string)
    }

    setHeldKeys([...heldKeysRef.current, heldKey])

  }, [isNote, noteFrom])
 

  const handleTouchEnd = useCallback((e: CustomTouchEvent) => {

    const releasedKey = e.explicitOriginalTarget.innerText
    
    if (isHeld(releasedKey) && isNote(releasedKey)) {
      const noteToStop = noteFrom(releasedKey)
      synth.stop(noteToStop)
    }
    
    setHeldKeys(heldKeys => heldKeys.filter(heldKey => heldKey !== releasedKey))      

  }, [isNote, noteFrom])


  // Event listeners

  useEffect(() => {  
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
  }, [handleKeyUp, handleKeyDown, handleTouchStart, handleTouchEnd]);


  // html helpers

  function randomColour() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const a = Math.floor(Math.random() * 11)/10

    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

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
