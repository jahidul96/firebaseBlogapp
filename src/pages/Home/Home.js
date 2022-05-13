import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase-config'
import './home.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { useNavigate } from 'react-router-dom'

export default function Home({ isAuth }) {

    const [allPost, setAllPost] = useState([])

    const navigate = useNavigate()

    const getCollectionRef = collection(db, 'posts')

    useEffect(() => {
        const getData = async () => {
            const data = await getDocs(getCollectionRef)
            setAllPost(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getData()
    }, [allPost])

    const goTosinglePost = (id) => {
        navigate(`singlepost${id}`)
    }

    const deletePost = async (id) => {
        const postDoc = doc(db, 'posts', id)
        await deleteDoc(postDoc)
    }

    return (
        <div className='homeFlexRoot'>

            {
                allPost.length == 0 ? <p>Loading...</p> : <>
                    {
                        allPost.map(post => (

                            <Card sx={{ maxWidth: 600, marginBottom: '20px' }} key={post.id}>
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={post.imageUrl}
                                />
                                <CardContent>
                                    <div className='deleteFlex'>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {post.title}
                                        </Typography>
                                        {
                                            isAuth && post.author.id === auth.currentUser.uid && <button className='deleteBtn' onClick={() => deletePost(post.id)}><DeleteForeverIcon /></button>
                                        }
                                    </div>
                                    <Typography style={{ marginTop: 10, marginBottom: -10 }} variant="body2" color="text.secondary">
                                        {
                                            post.desc.length > 300 ? post.desc.slice(0, 250).toLowerCase() + '...' : post.desc.toLowerCase()
                                        }
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' onClick={() => goTosinglePost(post.id)} size="small">See More</Button>
                                </CardActions>
                            </Card>
                        ))
                    }
                </>
            }

            <div className='socialIconContainer'>
                <span><FacebookIcon /></span>
                <span><GitHubIcon /></span>
                <span><EmailIcon /></span>
                <span><MessageIcon /></span>
                <span><InstagramIcon /></span>
                <span><WhatsAppIcon /></span>
            </div>
        </div>
    )
}
