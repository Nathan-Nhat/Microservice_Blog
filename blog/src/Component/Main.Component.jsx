import React, {useState} from 'react';
import {TextField, makeStyles, Paper, Typography, Button} from "@material-ui/core";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import SignupPage from '../Pages/SignupPage'
import MainPage from "../Pages/MainPage";
import ProfilePage from "../Pages/ProfilePage";
const useStyle = makeStyles({
    container: {
        marginTop:"2rem",
        width: "90%",
        maxWidth : "1080px",
        margin: "auto"
    },
    textInput: {}
})
const MainComponent = () => {
    const classes = useStyle()
    return (
        <div className={classes.container}>
            <Switch>
                <Route path={'/login'} component={LoginPage}/>
                <Route path='/signup' component={SignupPage}/>
                <Route exact path = '/' component={MainPage}/>
                <Route path='/profile/:userId' component={ProfilePage} />
            </Switch>

        </div>
    );
};

export default MainComponent;