import React from 'react';
import {get_data} from "./ApiCall";
import {URL_AUTH_SERVICE} from "./Constants";
import {fetch_user} from "./redux/Actions/ActionObjects/ActionsObjects";
import{useDispatch} from "react-redux";

const AuthComponent = () => {
    React.useEffect(() => {
        if (localStorage.getItem('jwt'))
            get_data(URL_AUTH_SERVICE + '/verify_login', true)
                .then(res => {
                    console.log(res)
                    let data = {
                        isAuthenticated: true,
                        id: res.data.user_id,
                        name: res.data.user_name,
                        email: res.data.user_email
                    }
                dispatch(fetch_user(data))
                })
    }, [])
    const dispatch = useDispatch()
    return (
        <div>

        </div>
    );
};

export default AuthComponent;