import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button} from "@material-ui/core";
import axios from 'axios'
import {URL_AUTH_SERVICE} from '../Constants'
import {useHistory} from 'react-router-dom'
const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        margin: "2rem auto",
        width : "70%",
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
    const handleChange = (e)=>{
        let value = e.target.value
        let name = e.target.name
        setState({...state, [name]: value})
    }
    const handleClick = (e)=>{
        axios.post(URL_AUTH_SERVICE + '/authenticate', state)
            .then(res => {
                localStorage.setItem('jwt', res.data.jwt)
                localStorage.setItem('user_id', res.data.user_id)
                history.push('/')
            })
    }
    return (
        <Paper className={classes.container}>
            <Typography variant={"h6"}>Login</Typography>
            <TextField required id="standard-required" label="Username" type="text" name = 'username' onChange={handleChange}/>
            <TextField required id="standard-required" label="Password" type="password" name = 'password' onChange={handleChange}/>
            <Button variant="contained" color="primary" onClick={handleClick} className={classes.button}> Login</Button>
        </Paper>
    );
};

export default LoginPage;