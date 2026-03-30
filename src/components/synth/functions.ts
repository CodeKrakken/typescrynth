export const calculateFrequency = (frequency: number, octave: string) => {

  for ( let i = 0 ; i < +octave; i++ ) {
    frequency *= 2
  }
  return +frequency.toFixed(2)
}
