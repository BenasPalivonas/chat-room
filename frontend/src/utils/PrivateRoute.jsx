import {Navigate} from 'react-router-dom'
import {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({children}) =>
    useContext(AuthContext) ? <Navigate to="/login"/> : children;

export default PrivateRoute;