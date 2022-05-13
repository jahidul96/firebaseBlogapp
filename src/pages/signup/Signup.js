import './signup.css';
import { auth, provider } from '../../firebase-config';
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from "react-router-dom";


export default function Signup({ setIsAuth }) {
    const navigate = useNavigate()
    const signinWithGoogle = () => {
        signInWithPopup(auth, provider).then(result => {
            localStorage.setItem('isAuth', true)
            setIsAuth(true);
            navigate('/')
        })
    }
    return (
        <div className='root'>
            <h2>Signup With your Google Account!!</h2>
            <div className='imgWrapper'>

                <button onClick={signinWithGoogle} className='btn'>
                    <img className='img' src='https://logowik.com/content/uploads/images/985_google_g_icon.jpg' />
                    <span className='text'>sign in with google</span>
                </button>
            </div>
        </div>
    )
}
