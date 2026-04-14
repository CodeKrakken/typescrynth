import { fireEvent, render } from "@testing-library/react"
import Keyboard from "./components/keyboard/Keyboard"

export const pressAndRelease = (key: string, repeat: string = '') => {
  if (repeat) return fireEvent.keyDown(document, { key: key, repeat: true })
  fireEvent.keyDown(document, { key: key })
  fireEvent.keyUp(document, { key: key })
}

export const touchAndRelease = (key: string) => {
  const { container } = render(<Keyboard />)
  const target = container.querySelector(`[data-key="${key}"]`)!
  fireEvent.touchStart(target)
  fireEvent.touchEnd(target)
}