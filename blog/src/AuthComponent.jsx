import React from 'react';
import {get_data} from "./ApiCall";
import {URL_AUTH_SERVICE} from "./Constants";
import {fetch_user} from "./redux/Actions/ActionObjects/ActionsObjects";
import {useDispatch} from "react-redux";
import {theme as defaultTheme} from "./Themes";
import {BrowserRouter as Router, Route} from "react-router-dom";
import AppbarComponent from "./Component/Appbar.Component";
import MainComponent from "./Component/Main.Component";
import WritePostComponent from "./Component/WritePost.Component";
import Notification from "./Component/Notifycation.Component";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {useSelector} from "react-redux";

const AuthComponent = () => {
    const [state, setState] = React.useState(true)
    React.useEffect(() => {
        console.log(localStorage.getItem('jwt'))
        if (localStorage.getItem('jwt') !== null) {
            setState(true)
            get_data(URL_AUTH_SERVICE + '/verify_login', {}, true)
                .then(res => {
                    console.log(res)
                    let data = {
                        isAuthenticated: true,
                        id: res.data.user_id,
                        name: res.data.user_name,
                        email: res.data.user_email
                    }
                    dispatch(fetch_user(data))
                    setState(false)
                })
                .catch(error =>
                        setState(false)
                )
        }
        else {
            setState(false)
        }
    }, [])
    const dispatch = useDispatch()
    return (
        <div>
            {state === true ?
                <img src={'https://thumbs.gfycat.com/AssuredZealousAmericanmarten-size_restricted.gif'}/> :
                <MuiThemeProvider theme={defaultTheme}>
                    <Router>
                        <AppbarComponent/>
                        <MainComponent/>
                        <Route path='/add_post' component={WritePostComponent}/>
                    </Router>
                    <Notification/>
                </MuiThemeProvider>
            }
        </div>
    );
};

export default AuthComponent;