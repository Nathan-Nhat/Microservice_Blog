import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button, useMediaQuery} from "@material-ui/core";
import axios from 'axios'
import {URL_AUTH_SERVICE} from '../Constants'
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {useDispatch} from 'react-redux'
import {open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
import {validatePassword} from "../Helper/ValidatePassword";
import {validateEmail} from "../Helper/ValidateEmail";
import {theme} from "../Themes";

const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        margin: props => props.isMobile ? "3rem auto" : '6rem auto',
        width: "100%",
        maxWidth: '25rem',
        '&>*': {
            marginTop: '1rem'
        }
    },
    input: {
        borderRadius: 'none',
        width: '100%'
    },
    title: {
        width: '100%',
        textAlign: 'center',
    },
    textInput: {},
    buttonSignup: {
        boxShadow: 'none',
        margin: 'auto',
        padding: '0.7rem 1rem 0.7rem 1rem',
        '&:hover': {
            boxShadow: 'none'
        },
    },
    main: {
        padding: '0 1rem',
        '&>*': {
            marginTop: '1rem'
        }
    }
})
const LoginPage = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile});
    const dispatch = useDispatch()
    const [state, setState] = useState({username: '', password: '', name: '', email: '', re_password: ''})
    const handleChange = (e) => {
        let value = e.target.value
        let name = e.target.name
        setState({...state, [name]: value})
    }
    const handleClick = (e) => {
        if (state.password !== state.re_password) {
            dispatch(open_notification(
                {
                    message: 'Your confirm password is not match. Please try again',
                    type: 'error'
                }
            ))
            return
        }
        if (!validatePassword(state.password)) {
            dispatch(open_notification(
                {
                    message: 'Invalid Password! Password must be contain at least one lowercase letter, ' +
                        'one uppercase letter, one numeric digit, and one special character',
                    type: 'error'
                }
            ))
            return
        }
        if (!validateEmail(state.email)) {
            dispatch(open_notification(
                {
                    message: 'Invalid Email!',
                    type: 'error'
                }
            ))
            return
        }
        if (state.username === '' || state.name === '') {
            dispatch(open_notification(
                {
                    message: 'You need to fill all required field',
                    type: 'error'
                }
            ))
            return
        }
        axios.post(URL_AUTH_SERVICE + '/sign_up', state)
            .then(res => {
                dispatch(open_notification({
                    message: 'Sign up success,a mail is sent to your email to verify your account. Please check!',
                    type: 'success'
                }))
            })
            .catch(err => dispatch(open_notification({message: 'Fail when sign up', type: 'error'})))
    }
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    return (
        <div>
            {
                isAuthenticated === false ?
                    <div className={classes.container}>
                        <Typography variant={"h6"} className={classes.title}>SIGN UP</Typography>
                        <div className={classes.main}>
                            <TextField required label="Username" type="text" name='username' className={classes.input}
                                       variant={'outlined'}
                                       onChange={handleChange}/>
                            <TextField required label="Name" type="text" name='name' className={classes.input}
                                       variant={'outlined'}
                                       onChange={handleChange}/>
                            <TextField required label="Email" type="email" name='email' className={classes.input}
                                       variant={'outlined'}
                                       onChange={handleChange}/>
                            <TextField required label="Password" type="password" name='password'
                                       className={classes.input}
                                       variant={'outlined'}
                                       onChange={handleChange}/>
                            <TextField required label="Re-Password" type="password" name='re_password'
                                       className={classes.input}
                                       variant={'outlined'}
                                       onChange={handleChange}/>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <Button variant="contained" color="primary" onClick={handleClick}
                                        className={classes.buttonSignup}> Sign up</Button>
                            </div>
                        </div>
                    </div>
                    : <Redirect to='/'/>
            }
        </div>
    );
};

export default LoginPage;