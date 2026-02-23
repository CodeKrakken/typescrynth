import './header.css'
import {title} from './data'

export default function Header() {
  return <>
    <div className="header">
      {title}
    </div>
  </>
}