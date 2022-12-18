import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import AuthContext from '../context/AuthContext'

import Back from '../assets/back.svg'
import '../styles/Chat.scss'
import axios from 'axios'

const Chat = () => {
    const {user, authTokens} = useContext(AuthContext)
    const {name, password} = useParams()
    const navigateTo = useNavigate()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`http://localhost:8000/room/${name}/${password}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${authTokens.access}`
                }
            })
                .then(response => response.json())
                .then(data => setMessages(data))
                .catch(() => {
                    alert("Something went wrong!")
                    navigateTo("/")
                })
        }
        const timer = setInterval(() => {fetchData()}, 1000)
        fetchData()
        return () => clearInterval(timer)
    }, [])

    const Send = async (e) => {
        e.preventDefault()
        let data = new FormData()
        data.append("message", e.target.message.value)
        data.append("image", e.target.image.files[0])
        await axios(`http://localhost:8000/room/${name}/${password}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authTokens.access}`,
                "Content-Type": "multipart/form-data"
            },
            data: data
        })
        e.target.reset()
        let messagesContainer = document.getElementById("messagesContainer")
        messagesContainer.scrollTo(0, 0)
    }

    return (
        <>
            <nav>
                <Link to='/'>
                    <img src={Back} alt="back button" width={40} height={40} />
                </Link>
                <h2>{name}</h2>
            </nav>
            <div className="messages">
                <div className="message" id='messagesContainer'>
                    {messages && messages.map((message) => {
                        return <div className={`${user.username === message.user ? 'owner' : 'another'}`}
                                    key={message.id}><h3>{message.user}</h3> <p>{message.message}</p>
                            {message.image ?
                                <img className='image' style={{'width': 'auto', 'height': "100px", "display": "block"}}
                                     src={`http://localhost:8000${message.image}`} loading="lazy" width={300}
                                     height={150} alt='image'/> : ''}
                        </div>
                    })}
                </div>
            </div>
            <form className='send' onSubmit={Send}>
                <input type="text" name="message" />
                <input type="file" name="image" />
                <input type="submit" value="Send" />
            </form>
        </>
    )
}
export default Chat