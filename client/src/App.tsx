import './App.css';
import Chats from './components/Chats';
import 'bootstrap/dist/css/bootstrap.min.css';
import { USER_ID } from './constants';
import Login from './components/Login';
import { useState } from 'react';
import LogoutIcon from './assets/LogoutIcon';
import { Button, Container } from 'react-bootstrap';

function App() {
  const userId = localStorage.getItem(USER_ID)
  const [isLoggedIn, setIsLoggedIn] = useState(!!userId)

  function handleIsLoggedIn(value: boolean) {
    setIsLoggedIn(value)
  }

  function handleLogout() {
    setIsLoggedIn(false)
    localStorage.clear()
  }

  return (
    <Container >
      <div className='p-2 d-flex justify-content-between'>
        <h3 >Simple Chat App</h3>
        <Button size='sm' variant='muted' onClick={handleLogout}><LogoutIcon /></Button>
      </div>

      {
        isLoggedIn ? <Chats /> : <Login handleIsLoggedIn={handleIsLoggedIn} />
      }

    </Container>
  );
}

export default App;
