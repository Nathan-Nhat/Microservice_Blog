import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button} from "@material-ui/core";
import axios from 'axios'
import {URL_AUTH_SERVICE} from '../Constants'
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";

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
    textInput: {}
})
const LoginPage = () => {
    const classes = useStyle();
    const [state, setState] = useState({username: '', password: '', name: '', email: ''})
    const handleChange = (e) => {
        let value = e.target.value
        let name = e.target.name
        setState({...state, [name]: value})
    }
    const handleClick = (e) => {
        axios.post(URL_AUTH_SERVICE + '/sign_up', state)
            .then(res => {

            })
    }
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    return (
        <div>
            {
                isAuthenticated === false ?
                    <Paper className={classes.container}>
                        <Typography variant={"h6"}>Sign up</Typography>
                        <TextField required id="standard-required" label="Username" type="text" name='username'
                                   onChange={handleChange}/>
                        <TextField required id="standard-required" label="Name" type="text" name='name'
                                   onChange={handleChange}/>
                        <TextField required id="standard-required" label="Email" type="email" name='email'
                                   onChange={handleChange}/>
                        <TextField required id="standard-required" label="Password" type="password" name='password'
                                   onChange={handleChange}/>
                        <Button variant="contained" color="primary" onClick={handleClick}> Sign up</Button>
                    </Paper>
                    : <Redirect to='/'/>
            }
        </div>
    );
};

export default LoginPage;