import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button} from "@material-ui/core";
import axios from 'axios'
import {URL_AUTH_SERVICE} from '../Constants'
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {useDispatch}from  'react-redux'
import {open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        margin: "6rem auto",
        width: "100%",
        maxWidth: '25rem',
        '&>*': {
            marginTop: '1rem'
        }
    },
     title: {
        width: '100%',
        textAlign: 'center',
        marginBottom: '1rem'
    },
    textInput: {},
     buttonSignup: {
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none'
        },
        marginBottom: '1rem'
    },
})
const LoginPage = () => {
    const classes = useStyle();
    const dispatch = useDispatch()
    const [state, setState] = useState({username: '', password: '', name: '', email: ''})
    const handleChange = (e) => {
        let value = e.target.value
        let name = e.target.name
        setState({...state, [name]: value})
    }
    const handleClick = (e) => {
        axios.post(URL_AUTH_SERVICE + '/sign_up', state)
            .then(res => {
                dispatch(open_notification({message :'Sign up success,a mail is sent to your email to verify your account. Please check!', type : 'success'}))
            })
            .catch(err => dispatch(open_notification({message : 'Fail when sign up', type : 'error'})))
    }
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    return (
        <div>
            {
                isAuthenticated === false ?
                    <div className={classes.container}>
                        <Typography variant={"h6"} className={classes.title}>SIGN UP</Typography>
                        <TextField required id="standard-required" label="Username" type="text" name='username' variant={'outlined'}
                                   onChange={handleChange}/>
                        <TextField required id="standard-required" label="Name" type="text" name='name' variant={'outlined'}
                                   onChange={handleChange}/>
                        <TextField required id="standard-required" label="Email" type="email" name='email' variant={'outlined'}
                                   onChange={handleChange}/>
                        <TextField required id="standard-required" label="Password" type="password" name='password' variant={'outlined'}
                                   onChange={handleChange}/>
                        <Button variant="contained" color="primary" onClick={handleClick} className={classes.buttonSignup}> Sign up</Button>
                    </div>
                    : <Redirect to='/'/>
            }
        </div>
    );
};

export default LoginPage;