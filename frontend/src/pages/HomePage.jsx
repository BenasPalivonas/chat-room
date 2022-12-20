import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

import "../styles/HomePage.scss"

const HomePage = () => {
    const {user, authTokens} = useContext(AuthContext)
    const navigateTo = useNavigate()
    const {logoutUser} = useContext(AuthContext)
    const password = 1

    const enterRoom = (e) => {
        e.preventDefault()
        navigateTo(`/${e.target.room.value}/1`)
    }

    const CreateRoom = async (e) => {
        e.preventDefault()

        await fetch(`http://localhost:8000/room/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authTokens.access}`
            }, body: JSON.stringify({'name': e.target.name.value, 'password': e.target.password.value || password})
        })
        .then(response => response.json())
        .then(data => {
            data.status === 200 ? navigateTo(`/${e.target.name.value}/1`) : alert("Error Creating room")
        })
    }

    const deleteAccount = async (e) => {
        e.preventDefault()
        logoutUser()
        await fetch(`http://localhost:8000/user/delete`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authTokens.access}`
            }, body: JSON.stringify({'username': user.username, 'password': e.target.password.value || password})
        })
    }

    return (
        <div id='enterRoom'>
            <button id='logout' onClick={logoutUser}>Logout</button>
            <button id='deleteAccount' onClick={deleteAccount}>Delete Account</button>
            <form onSubmit={enterRoom}>
                <label htmlFor="room">Enter the room's name</label>
                <input type="text" name="room" placeholder='Room name...' />
                <button type="submit">Enter</button>
            </form>
            <form onSubmit={CreateRoom}>
                <h3>or <br /> Create room</h3>
                <label htmlFor="name">Enter the room's name</label>
                <input type="text" name="name" placeholder='Room Name...' />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default HomePage