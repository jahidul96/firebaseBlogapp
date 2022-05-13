
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Home from './pages/Home/Home';
import Signup from './pages/signup/Signup';
import Post from './pages/post/Post';
import { useState } from 'react';
import { signOut } from 'firebase/auth'
import { auth } from './firebase-config';
import SinglePost from './pages/singlepost/SinglePost';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));


  const signOutUser = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = '/signup'
    })
  }
  return (
    <Router>
      <div>
        <nav className='navbar'>
          <ul>
            <li><Link to="/" className='link'>Home</Link></li>
            {!isAuth ? <li><Link to="/signup" className='link'>SignUp</Link></li> :
              <>
                <li><Link to="/post" className='link'>Create Post</Link></li>
                <button className='signOutBtn' onClick={signOutUser}>Sign out</button>
              </>}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home isAuth={isAuth} />} />
          <Route path="/signup" element={<Signup setIsAuth={setIsAuth} />} />
          <Route path="/post" element={<Post isAuth={isAuth} />} />
          <Route path="/singlepost:id" element={<SinglePost isAuth={isAuth} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <div className='footerContainer'>
          <p>All Right Reserved by jahidul islam.</p>
        </div>
      </div>
    </Router>
  );
}



export default App;
