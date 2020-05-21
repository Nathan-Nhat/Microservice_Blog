import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button, Divider} from "@material-ui/core";
import axios from 'axios'
import {URL_AUTH_SERVICE} from '../Constants'
import {useHistory} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {fetch_user, open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
import {useSelector} from "react-redux";
import {useLocation, NavLink, Redirect} from 'react-router-dom'
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import SendIcon from '@material-ui/icons/Send';
import {get_data, post_data} from "../ApiCall";
import queryString from 'query-string'

const useStyle = makeStyles(theme => ({
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
    input: {
        borderRadius: 'none',
    },
    buttonLogin: {
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none'
        },
        marginBottom: '1rem'
    },
    title: {
        width: '100%',
        textAlign: 'center',
        paddingBottom: '1rem'
    },
    moreOption: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    toSignup: {
        textAlign: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: theme.palette.primary.dark,
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.light
        }
    },
    responseSuccess: {
        fontStyle: 'italic',
        border: '1px solid green',
        color: 'green',
        fontSize: '0.8rem',
        padding: '0.6rem',
        borderRadius: '1rem',
        paddingBottom: '1rem',
        wordWrap: 'break'
    },
    responseFail: {
        fontStyle: 'italic',
        border: '1px solid red',
        color: 'red',
        fontSize: '0.8rem',
        padding: '0.6rem',
        borderRadius: '1rem',
        paddingBottom: '1rem'
    }
}))


const LoginPage = () => {
    const classes = useStyle();
    const [state, setState] = useState({
        username: '',
        password: '',
        isOpen: false,
        emailPass: '',
        emailConfirm: '',
        isSent: 0,
        resMessage: '',
        is_confirm_open: false
    })
    const history = useHistory()
    const location = useLocation()
    const type = queryString.parse(location.search).type
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
                let data = {
                    isAuthenticated: true,
                    id: res.data.user_id,
                    email: res.data.user_email,
                    name: res.data.name
                }
                dispatch(fetch_user(data))
                if (location.state)
                    history.push(location.state.nextUrl)
                else
                    history.push('/')
                dispatch(open_notification({message: 'Login Success', type: 'success'}))
            })
            .catch(error => dispatch(open_notification({message: error.response.data.message, type: 'error'})))
    }
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    const handleForgotPass = () => {
        setState({...state, isOpen: true})
    }
    const handleClose = () => {
        setState({...state, isOpen: false, isSent: 0})
    }
    const handleSendPass = () => {
        let data = {
            email: state.emailPass
        }
        post_data(URL_AUTH_SERVICE + '/reset_password', {}, data, false)
            .then(res => {
                setState({
                    ...state,
                    isSent: 1
                })
            })
            .catch(error => {
                setState({
                    ...state,
                    isSent: 2
                })
            })
    }

    const handleConfirmClose = () => {
        setState({...state, is_confirm_open: false, isSent: 0})
    }
    const handleConfirm = () => {
        setState({...state, is_confirm_open: true})
    }
    const handleSendConfirm = () => {
        get_data(URL_AUTH_SERVICE + '/re_confirm', {email: state.emailConfirm}, false)
            .then(res => {
                setState({
                    ...state,
                    isSent: 1
                })
            })
            .catch(error => {
                setState({
                    ...state,
                    isSent: 2
                })
            })
    }
    return (
        <div>
            {
                isAuthenticated === false ?
                    < div className={classes.container}>
                        <Typography variant={"h5"} className={classes.title}>LOGIN</Typography>
                        {
                            type === undefined ? <div></div> : type === '0' ?
                                <Typography className={classes.responseSuccess}>
                                    Your account have been confirmed! Please login
                                </Typography> :
                                    <Typography className={classes.responseFail}>
                                        Error when confirm your account.Please try again
                                    </Typography>
                        }
                        <TextField required id="username" label="Username" type="text" name='username'
                                   variant={'outlined'} className={classes.input}
                                   onChange={handleChange}/>
                        <TextField required id="password" label="Password" type="password" name='password'
                                   variant={'outlined'} className={classes.input}
                                   onChange={handleChange}/>
                        <Button variant="contained" color="primary" onClick={handleClick}
                                className={classes.buttonLogin}> Login</Button>
                        <Divider variant={'middle'}/>
                        <div className={classes.moreOption}>
                            <Typography className={classes.toSignup}>Don't have account yet? Click <NavLink
                                to={'/signup'}>Sign
                                up</NavLink></Typography>
                            <Typography className={classes.forgotPassword} onClick={handleForgotPass}>Forgot
                                password?</Typography>
                            <Typography className={classes.forgotPassword} onClick={handleConfirm}>Not confirm your
                                account yet?</Typography>
                        </div>
                        <Dialog open={state.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-forgot_password">Forgot Password</DialogTitle>
                            <DialogContent style={{maxWidth: '20rem'}}>
                                <div>
                                    {
                                        state.isSent === 0 ? <div></div> :
                                            state.isSent === 1 ?
                                                <Typography className={classes.responseSuccess}>
                                                    An email was sent to your email. Please check your
                                                    email
                                                </Typography> :
                                                <Typography className={classes.responseFail}>
                                                    Error when sending email.Please try again
                                                </Typography>
                                    }
                                </div>
                                <div className={classes.main}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Email"
                                        type="email"
                                        value={state.emailPass}
                                        name='emailPass'
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Button style={{width: '100%', marginTop: '1rem'}} color='primary'
                                            variant={'contained'} className={classes.buttonLogin}
                                            onClick={handleSendPass}>
                                        <SendIcon style={{paddingRight: '1rem'}}/>
                                        Send
                                    </Button>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={state.is_confirm_open} onClose={handleConfirmClose}
                                aria-labelledby="form-dialog-confirm">
                            <DialogTitle id="form-dialog-confirm">Confirm account</DialogTitle>
                            <DialogContent style={{maxWidth: '20rem'}}>
                                <div>
                                    {
                                        state.isSent === 0 ? <div></div> :
                                            state.isSent === 1 ?
                                                <Typography className={classes.responseSuccess}>
                                                    An email reset password was sent to your email. Please check your
                                                    email
                                                </Typography> :
                                                <Typography className={classes.responseFail}>
                                                    Error when sending email.Please try again
                                                </Typography>
                                    }
                                </div>
                                <div className={classes.main}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Email"
                                        type="email"
                                        value={state.emailConfirm}
                                        name='emailConfirm'
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Button style={{width: '100%', marginTop: '1rem'}} color='primary'
                                            variant={'contained'} className={classes.buttonLogin}
                                            onClick={handleSendConfirm}>
                                        <SendIcon style={{paddingRight: '1rem'}}/>
                                        Send
                                    </Button>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleConfirmClose} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div> : <Redirect to='/'/>
            }
        </div>
    );
};

export default LoginPage;