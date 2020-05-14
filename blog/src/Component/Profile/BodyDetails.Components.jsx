import React from 'react';
import {useSelector} from "react-redux";
import {Switch, Route} from 'react-router-dom'
import PostUserComponent from "./PostUser.Component";
import FollowerUserComponent from "./FollowerUser.Component";
import FollowingUserComponents from "./FollowingUser.Components";

const BodyDetailsComponents = () => {
    return (
        <div style = {{padding : '2rem'}}>
            <Switch>
                <Route exact path={'/profile/:user_id'}><PostUserComponent/></Route>
                <Route path={'/profile/:user_id/followers'}><FollowerUserComponent/></Route>
                <Route path={'/profile/:user_id/following'}><FollowingUserComponents/></Route>
            </Switch>
        </div>
    );
};

export default BodyDetailsComponents;