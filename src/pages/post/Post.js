
import { useState, useEffect } from 'react'
import './post.css'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db, auth, storage } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { v4 } from 'uuid';


export default function Post({ isAuth }) {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState('');
    const [progressBar, setProgressBar] = useState(0);

    const navigate = useNavigate()

    const postData = () => {


        if (title === '' || desc === '') {
            alert('Please fill all the fields');
            return
        }
        if (title.length < 6 || desc.length < 20) {
            alert('title must have at least 6 letter and description should have at least 20 letter\'s ');
            return
        }

        const storageRef = ref(storage, `images/${image.name} ${v4()}`);
        const uploadImage = uploadBytesResumable(storageRef, image);

        uploadImage.on('state_changed', (snapshot) => {
            const pogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes * 100));
            setProgressBar(pogress)
        },
            (err) => {
                console.log(err)
            },
            () => {
                setTitle('');
                setDesc('');
                setImage('');

                getDownloadURL(uploadImage.snapshot.ref).then((url) => {
                    const postRef = collection(db, 'posts');
                    addDoc(postRef, {
                        title,
                        desc,
                        imageUrl: url,
                        author: {
                            name: auth.currentUser.displayName,
                            id: auth.currentUser.uid
                        },
                        createdAt: Date.now()
                    }).then(() => {
                        alert('posted succesfully');
                        setProgressBar(0);
                        navigate('/')
                    }).catch((err) => {
                        alert(err.message)
                    })
                })
            }
        )
    }

    useEffect(() => {
        if (!isAuth) {
            navigate('/signup')
        }
    }, [])
    return (
        <div className='postContainer'>
            <h2 className='h2title'>Create Your Post</h2>
            <div>
                <input value={title} className="inputStylePost" onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' />
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='Description'></textarea>

                <input type='file' className='fileBtn' onChange={(e) => setImage(e.target.files[0])} />

                <button onClick={postData} className='postBtn'>Post</button>

            </div>
        </div>
    )
}
