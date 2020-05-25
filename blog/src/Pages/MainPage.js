import React from 'react';
import AllPostComponents from "../Component/Post/AllPost.Components";
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../Themes";
import MainRightComponent from '../Component/Post/MainRight.Component'
import HeaderPost from "../Component/Post/HeaderPost";
import {Route, Switch, Redirect} from 'react-router-dom'

const MainPage = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{
                display: 'flex', flexDirection: 'column', width: '100%',
                padding: isMobile ? "2rem 1rem 1rem 1rem" : '4rem 0rem 2rem 2rem'
            }}>
                <HeaderPost/>
                    <Route path={'/p/newest'} component={AllPostComponents}/>
                    <Route path={'/p/saved'} component={AllPostComponents}/>
                    <Route path={'/p/followed_tags'} component={AllPostComponents}/>
            </div>
            {
                isMobile ? null :
                    <MainRightComponent/>
            }
        </div>
    );
};

export default MainPage;