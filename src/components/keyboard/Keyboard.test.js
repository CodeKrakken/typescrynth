import { render, screen, fireEvent } from '@testing-library/react'
import Keyboard from './Keyboard'

describe('keyboard', function() {
  beforeEach(function() {
    render(<Keyboard />)
  })

  it('renders a key', function() {
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has C4 key', function() {
    expect(screen.getByText('C4')).toBeInTheDocument()
  })

  it('plays a C4 note when clicked', function() {
    fireEvent.click(screen.getByText('C4'))
    expect(screen.getByText('Played note C4.')).toBeInTheDocument()
  })
})