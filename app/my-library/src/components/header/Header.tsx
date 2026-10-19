import {Avatar, Button} from "@mui/material";
import './Header.scss'

export function Header() {
    return (
        <header className='container'>
            <div className='header'>
              <a href='/' className='header__link'>Book App</a>
              <div className='header__right'>
                  <Button className='btn-upload'>Upload book</Button>
                  <Avatar className='btn-profile'>TV</Avatar>
              </div>
            </div>
        </header>
    );
}