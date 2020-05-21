import React from 'react';
import {makeStyles} from "@material-ui/core";
import {Switch, Route} from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import SignupPage from '../Pages/SignupPage'
import MainPage from "../Pages/MainPage";
import ProfilePage from "../Pages/ProfilePage";
import SinglePostPage from "../Pages/SinglePostPage";
import SearchPage from "../Pages/SearchPage";
import TagFollowPage from '../Pages/TagFollowPage'
import ChangePasswordPage from '../Pages/ChangePasswordPage'
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../Themes";

const useStyle = makeStyles({
    container: {
        width: '100%',
        maxWidth : "1080px",
        margin: "auto"
    },
    textInput: {}
})
const MainComponent = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const classes = useStyle({isMobile})
    return (
        <div className={classes.container}>
            <Switch>
                <Route path={'/login'} component={LoginPage}/>
                <Route path='/signup' component={SignupPage}/>
                <Route exact path = '/' component={MainPage}/>
                <Route path='/profile/:userId' component={ProfilePage} />
                <Route path='/post/:post_id' component={SinglePostPage}/>
                <Route path={'/search'} component={SearchPage} />
                <Route path={'/tag/:tag_id'} component={TagFollowPage} />
                <Route path={'/change_password'} component={ChangePasswordPage} />
            </Switch>

        </div>
    );
};

export default MainComponent;