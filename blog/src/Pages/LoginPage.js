import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button} from "@material-ui/core";
import axios from 'axios'
import {URL_AUTH_SERVICE} from '../Constants'
import {useHistory} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {fetch_user, open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
import {useSelector} from "react-redux";
import {Redirect} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        margin: "2rem auto",
        width: "70%",
        padding: "2rem",
        '&>*': {
            marginTop: '2rem'
        }
    },
})
const LoginPage = () => {
    const classes = useStyle();
    const [state, setState] = useState({username: '', password: ''})
    const history = useHistory()
    const location = useLocation()
    const handleChange = (e) => {
        let value = e.target.value
        let name = e.target.name
        setState({...state, [name]: value})
    }
    const dispatch = useDispatch()
    const handleClick = (e) => {
        axios.post(URL_AUTH_SERVICE + '/authenticate', state)
            .then(res => {
                localStorage.setItem('jwt', res.data.jwt)
                localStorage.setItem('user_id', res.data.user_id)
                let data = {
                    isAuthenticated: true,
                    id : res.data.user_id,
                    email : res.data.user_email,
                    name : res.data.name
                }
                dispatch(fetch_user(data))
                if (location.state)
                    history.push(location.state.nextUrl)
                else
                    history.push('/')
                dispatch(open_notification({message: 'Login Success', type: 'success'}))
            })
            .catch(error => dispatch(open_notification({message: 'Login fail. Please try again.', type: 'error'})))
    }
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    return (
        <div>
            {
                isAuthenticated === false?
                < Paper className={classes.container}>
                    <Typography variant={"h6"}>Login</Typography>
                    <TextField required id="username" label="Username" type="text" name='username'
                    onChange={handleChange}/>
                    <TextField required id="password" label="Password" type="password" name='password'
                    onChange={handleChange}/>
                    <Button variant="contained" color="primary" onClick={handleClick}
                    className={classes.button}> Login</Button>
                </Paper> : <Redirect to='/' />
                }
                </div>
                );
                };

                export default LoginPage;