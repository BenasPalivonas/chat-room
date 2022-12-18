import {createContext, useEffect, useState} from 'react'
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom'
import {isValidForm} from "../utils/validationUtils.js";

const AuthContext = createContext(undefined)

export default AuthContext;


export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    const [loading, setLoading] = useState(true)

    const navigateTo = useNavigate()

    const loginRequest = async (username, password) =>
        await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })

    const loginUser = async (e) => {
        e.preventDefault()
        loginRequest(e.target.username.value, e.target.password.value)
            .then(async (response) => {
                const data = await response.json()
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                navigateTo('/')
            })
            .catch(() => alert('Something went wrong!'))
    }

    const registrationRequest = async (username, password) =>
        await fetch('http://localhost:8000/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })

    const registerUser = async (e) => {
        e.preventDefault()
        const username = e.target.username.value
        const password = e.target.password.value

        if (!isValidForm(username, password))
            return;

        registrationRequest(username, password)
            .then(data => {
                if (data.ok)
                    loginUser(e)
                else
                    alert("This Name Already Exists")
            })
            .catch(err => console.log(err))
    }


    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    const updateTokenRequest = async () =>
        await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        })


    const updateToken = async () => {
        updateTokenRequest
            .then(async (response) => {
                const data = await response.json()
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
            })
            .catch(logoutUser)

        if (loading)
            setLoading(false)
    }

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
    }


    useEffect(() => {
        if (loading)
            updateToken()

        const fourMinutes = 1000 * 60 * 4

        const interval = setInterval(() => {
            if (authTokens)
                updateToken()
        }, fourMinutes)
        return () => clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}