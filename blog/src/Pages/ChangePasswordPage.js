import React from 'react';
import {useParams} from 'react-router-dom'
import {get_data, post_data} from "../ApiCall";
import {URL_AUTH_SERVICE} from "../Constants"
import {TextField, Button} from "@material-ui/core";
import queryString from 'query-string'
import {useLocation} from 'react-router-dom'
const ChangePasswordPage = () => {
    const location = useLocation()
    const param = queryString.parse(location.search)
    const token = param.token
    const user_id = param.user_id
    const [state, setState] = React.useState({
        user_id : user_id,
        token : token,
        password : '',
        re_password : ''
    })
    const handleChange = (e)=>{
        let name = e.target.name
        let val = e.target.value
        setState({
            ...state,
            [name] : val
        })
    }
    const handleClick = ()=>{
        if (state.password !== state.re_password) return
        let data = {
            user_id : state.user_id,
            token : state.token,
            password : state.password
        }
        post_data(URL_AUTH_SERVICE + '/change_password', {},data, false)
            .then(res=>{
                console.log(res)
            })
    }
    return (
        <div>
            <TextField value={state.password} label={'Password'} name = {'password'} onChange={handleChange}/>
            <TextField value={state.re_password} label={'Re-Password'} name = {'re_password'} onChange={handleChange}/>
            <Button onClick={handleClick}>Change password</Button>
        </div>
    );
};

export default ChangePasswordPage;