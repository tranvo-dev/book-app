import { Avatar, Button } from '@mui/material'
import './Header.scss'

export function Header() {
  return (
    <header className="header-container">
      <div className="header">
        <a href="/" className="header__link">
          Book App
        </a>
        <div className="header__right">
          <Button className="btn-upload">Upload book</Button>
          {/*TODO fulfill the logged in user initials*/}
          <Avatar className="btn-profile">TV</Avatar>
        </div>
      </div>
    </header>
  )
}
