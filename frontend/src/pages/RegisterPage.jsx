import React, {useContext} from 'react';
import AuthContext from '../context/AuthContext';
import {Link} from 'react-router-dom';

import "../styles/LoginPage.scss"

const RegisterPage = () => {
    const {registerUser} = useContext(AuthContext)

    return (
        <div id='login'>
            <Link id="register" to='/login'>Login</Link>
            <form onSubmit={registerUser}>
                <h2>Register</h2>
                <input type="text" name='username' placeholder='Enter Username'/>
                <input type="password" name="password" placeholder='Enter Password'/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
export default RegisterPage