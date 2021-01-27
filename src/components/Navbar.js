import { NavLink, useHistory } from 'react-router-dom'
import { BiUserCircle } from 'react-icons/bi'

export default function Navbar() {
  return (
    <header>
      <ul>
        <NavLink to="/">Tect.dev</NavLink>
        <NavLink to="/user">
          <BiUserCircle />
        </NavLink>

        <li>검색</li>
      </ul>
    </header>
  )
}
