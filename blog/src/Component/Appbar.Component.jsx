import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux";
import {fetch_user} from "../redux/Actions/ActionObjects/ActionsObjects";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    link: {
        marginRight: "1rem"
    }
}));

const AppbarComponent = () => {
    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch()
    const handleClick = (e, index) => {
        e.preventDefault()
        if (index === 1) history.push('/login')
        else if (index === 2) history.push('/signup')
        else if (index === 3) history.push('/add_post')
        else {
            localStorage.removeItem('jwt')
            localStorage.removeItem('user_id')
            let data = {
                isAuthenticated: false,
                id: 0,
                name: '',
                email: ''
            }
            dispatch(fetch_user(data))
            window.location.reload(false);
        }
    }
    const handleHome = () => {
        history.push('/')
    }
    const isAuthenticate = useSelector(state => state.AuthenReducer.isAuthenticated)
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <Button onClick={handleHome}><Typography variant="h5"
                                                         style={{color: "white", fontWeight: "bold"}}>Blog</Typography></Button>
                <div className={classes.title}>
                </div>
                {
                    isAuthenticate === false ?
                        <div>
                            <Button color="inherit" className={classes.link} onClick={(e) => handleClick(e, 1)}>
                                Login
                            </Button>
                            <Button color="inherit" className={classes.link} onClick={(e) => handleClick(e, 2)}>
                                Sign up
                            </Button>
                        </div> :
                        <div>
                            <Button color="inherit" className={classes.link} onClick={(e) => handleClick(e, 3)}>
                                Add post
                            </Button>
                            <Button color="inherit" className={classes.link} onClick={(e) => handleClick(e, 4)}>
                                Logout
                            </Button>
                        </div>
                }

            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;