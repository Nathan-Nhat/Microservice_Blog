import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom'

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
    link : {
        marginRight : "1rem"
    }
}));

const AppbarComponent = () => {
    const classes = useStyles();
    const history = useHistory()
    const handleClick = (e, index) =>{
        e.preventDefault()
        if (index === 1) history.push('/login')
        else if (index === 2) history.push('/signup')
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6">Blog</Typography>
                <div className={classes.title}>
                </div>
                <Button color="inherit" className={classes.link} onClick = {(e)=> handleClick(e, 1)}>
                    Login
                </Button>
                <Button color="inherit" className={classes.link} onClick = {(e)=> handleClick(e, 2)}>
                    Sign up
                </Button>

            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;