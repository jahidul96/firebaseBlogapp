import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { db, auth } from '../../firebase-config';
import { getDoc, getDocs, doc, addDoc, collection, deleteDoc } from 'firebase/firestore'
import './singlepost.css'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export default function SinglePost({ isAuth }) {
    const [singleData, setSingleData] = useState('');
    const [comment, setComment] = useState('')
    const [allComments, setAllComments] = useState([])
    const id = useParams().id;

    const getCollectionRef = collection(db, 'comments')

    useEffect(() => {
        const getOnePost = async () => {

            const oneDoc = doc(db, 'posts', id)
            const data = await getDoc(oneDoc);
            if (data.exists()) {
                setSingleData(data.data());
            } else {
                console.log("No such document!");
            }
        }
        getOnePost();

        const getAllComments = async () => {
            const data = await getDocs(getCollectionRef)
            setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }

        getAllComments()
    }, [allComments])

    const postComment = () => {
        addDoc(getCollectionRef, {
            comment,
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid
            },
            createdAt: Date.now(),
            articleId: id
        }).then(() => {
            alert('comment added');
            setComment('')
        }).catch((err) => {
            console.log(err.message)
        })
    }

    const deleteComment = async (id) => {
        const delDoc = doc(db, 'comments', id)
        await deleteDoc(delDoc)
    }

    return (
        <div>

            <div className="singlePostStyle" >
                <h2>{singleData.title}</h2>

                <div className='singleAuthContainer'>
                    <h4 style={{ marginBottom: 5 }}>Author Name : <span className='authorNameStyle'>{singleData?.author?.name}</span> </h4>
                    <p>{new Date(singleData.createdAt).toDateString()}</p>
                </div>
                <div>
                    <img src={singleData.imageUrl} className="singleImgStyle" />
                </div>
                <p className='pText'>{singleData.desc}</p>

                <div className='commentContainer'>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className='cInput' placeholder='add your comment...' />
                    <div className='btnDiv'>
                        {
                            isAuth ? <button onClick={postComment} className='commentBtn'>submit</button> : <p style={{ color: '#333', fontSize: 18 }}>to comment sign in first</p>
                        }
                    </div>

                </div>
                <div>
                    {
                        allComments.map((article) => (
                            <div key={article.id} className='cmntWrapper'>
                                {
                                    article.articleId == id ?
                                        <div>
                                            <div className='commentProfile'>
                                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgXggn-861uzoWDk3H0TsKz2kggjq-0akJvtpPd7L8ELcZcDhYGYZDs92m30CD221FAAk&usqp=CAU' />
                                                <h4>{article.author.name}</h4>
                                            </div>
                                            <div className='comments'>
                                                <div>
                                                    <p className='cText'>{article.comment}</p>
                                                    <p className='dateP'>{new Date(article.createdAt).toDateString()}</p>
                                                </div>
                                                {
                                                    article.author.id == auth?.currentUser?.uid ? <button className='cmntDel' onClick={() => deleteComment(article.id)}><DeleteForeverIcon /></button> : ''
                                                }

                                            </div>
                                        </div>

                                        : ''
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
