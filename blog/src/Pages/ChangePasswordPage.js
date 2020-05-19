import React from 'react';
import {useParams} from 'react-router-dom'
import {get_data, post_data} from "../ApiCall";
import {URL_AUTH_SERVICE} from "../Constants"
import {TextField, Button, Typography} from "@material-ui/core";
import queryString from 'query-string'
import {useLocation, useHistory} from 'react-router-dom'
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
import {validatePassword} from "../Helper/ValidatePassword";

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
})
const ChangePasswordPage = () => {
    const location = useLocation()
    const param = queryString.parse(location.search)
    const token = param.token
    const user_id = param.user_id
    const [state, setState] = React.useState({
        user_id: user_id,
        token: token,
        password: '',
        re_password: ''
    })
    const history = useHistory()
    const handleChange = (e) => {
        let name = e.target.name
        let val = e.target.value
        setState({
            ...state,
            [name]: val
        })
    }
    const dispatch = useDispatch()
    const handleClick = () => {
        if (state.password !== state.re_password) {
            dispatch(open_notification(
                {
                    message : 'Your confirm password is not match. Please try again',
                    type : 'error'
                }
            ))
            return
        }
        if (!validatePassword(state.password)) {
            dispatch(open_notification(
                {
                    message : 'Invalid Password! Password must be contain at least one lowercase letter, ' +
                        'one uppercase letter, one numeric digit, and one special character',
                    type : 'error'
                }
            ))
            return
        }
        let data = {
            user_id: state.user_id,
            token: state.token,
            password: state.password
        }
        post_data(URL_AUTH_SERVICE + '/change_password', {}, data, false)
            .then(res => {
                dispatch(open_notification({message: 'Success! Please login with new password', type :'success'}))
                history.push('/login')
            })
            .catch(err=>{
                dispatch(open_notification({message: 'There is some error.Please try again', type :'Error'}))
            })
    }
    const classes = useStyle()
    return (
        <div>
            < div className={classes.container}>
                <Typography variant={"h5"} className={classes.title}>RESET PASSWORD</Typography>
                <TextField required label="Password" type="password" name='password'
                           variant={'outlined'} className={classes.input}
                           onChange={handleChange}/>
                <TextField required label="Re-password" type="password" name='re_password'
                           variant={'outlined'} className={classes.input}
                           onChange={handleChange}/>
                <Button variant="contained" color="primary" onClick={handleClick}
                        className={classes.buttonLogin}>Change password</Button>
            </div>
        </div>
    );
};

export default ChangePasswordPage;