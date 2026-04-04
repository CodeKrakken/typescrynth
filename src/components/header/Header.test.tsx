import { render } from '@testing-library/react'
import Header from './Header'

jest.mock('./data', () => ({
  title: 'Test Title'
}))

describe('Header', () => {
  it('renders title', () => {
    const { getByText } = render(<Header />)

    expect(getByText('Test Title')).toBeInTheDocument()
  })
})