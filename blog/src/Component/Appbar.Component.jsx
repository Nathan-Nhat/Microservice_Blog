import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux";
import {fetch_user} from "../redux/Actions/ActionObjects/ActionsObjects";
import {Input, InputAdornment, Divider, Tooltip} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import {withStyles} from "@material-ui/core";
import SubdirectoryArrowRightRoundedIcon from '@material-ui/icons/SubdirectoryArrowRightRounded';
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../Themes";
import {Drawer, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import defaultAvatar from '../image/default_avatar.jpg'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    toolbar: {
        width: props => props.isMobile ? '100%' : "70%",
        maxWidth: "1378px",
        padding: 0,
        margin: 'auto'
    },
    title: {
        flexGrow: 1
    },
    link: {
        marginRight: "1rem"
    },
    search: {
        marginLeft: '1rem',
        paddingLeft: '0.2rem',
        borderRadius: '2rem',
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        width: props => props.isMobile?'100%':'15rem',
        maxWidth: props => props.isMobile?'15rem' : '100rem',
        flexGrow: props => props.isMobile?1:0,
        marginRight:'1rem',
        paddingRight: '1rem',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, .3)'
        }
    },
    loginButton: {
        display: props => props.isMobile ? 'none' : ''
    }
}));

export const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
    arrow: {
        color: "#f5f5f9"
    }
}))(Tooltip);

const AppbarComponent = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const classes = useStyles({isMobile});
    const history = useHistory()
    const dispatch = useDispatch()
    const [state, setState] = React.useState({
        search: ''
    })

    async function handleClick(e, index) {
        e.preventDefault()
        if (index === 1) history.push('/login')
        else if (index === 2) history.push('/signup')
        else if (index === 3) history.push('/add_post')
        else if (index === 4) {
            history.push(`/profile/${id}`)
        } else {
            localStorage.removeItem('jwt')
            let data = {
                isAuthenticated: false,
                id: 0,
                name: '',
                email: ''
            }
            dispatch(fetch_user(data))
        }
        if (isMobile){
            setDrawOpen(false)
        }
    }

    const handleHome = () => {
        history.push('/')
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            history.push(`/search?query=${state.search}`)
            setState({...state, search: ''})
        }
    }
    const handleChange = (e) => {
        let name = e.target.name
        let val = e.target.value
        setState({
            ...state,
            [name]: val
        })
    }
    const [isDrawOpen, setDrawOpen] = React.useState(false)
    const {isAuthenticated, id, user_avatar, name} = useSelector(state => state.AuthenReducer)
    console.log(user_avatar)
    const toggleDrawer = () => {
        setDrawOpen(true)
    }
    const handleCloseDraw = () => {
        setDrawOpen(false)
    }
    return (
        <AppBar position="static" style={{boxShadow: 'none', paddingLeft: '1rem'}}>
            <Toolbar className={classes.toolbar}>
                {
                    !isMobile ? null :
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon/>
                        </IconButton>
                }
                <Button onClick={handleHome}><Typography variant="h5"
                                                         style={{color: "white", fontWeight: "bold"}}>Blog</Typography></Button>

                <HtmlTooltip disableHoverListener arrow={true}
                             title={
                                 <React.Fragment>
                                     <Typography style={{fontSize: '0.7rem'}}>{`Press `}
                                         <div style={{
                                             border: "1px solid #888a8c",
                                             padding: '0 0.5rem 0 0.5rem',
                                             borderRadius: '3px',
                                             display: 'inline-block'
                                         }}>
                                             <SubdirectoryArrowRightRoundedIcon
                                                 style={{fontSize: '0.7rem', paddingRight: '0.3rem'}}/>
                                             Enter
                                         </div>
                                         {` to search`}</Typography>
                                 </React.Fragment>
                             }
                >
                    <Input className={classes.search} onKeyDown={handleKeyDown}
                           id="input-with-icon-textfield" disableUnderline
                           onChange={handleChange}
                           name="search" value={state.search}
                           startAdornment={(<InputAdornment>
                               <SearchIcon style={{paddingLeft: '0.5rem', paddingRight: '0.5rem', color: 'white'}}/>
                           </InputAdornment>)}
                    />
                </HtmlTooltip>
                <div className={classes.title}>
                </div>
                {
                    isMobile ?
                        <Drawer anchor={'left'} open={isDrawOpen} onClose={handleCloseDraw}>
                            <img style={{height: '6rem', width: '6rem', margin: '2rem auto 1rem auto', borderRadius: '50%'}}
                                 src={isAuthenticated ? user_avatar : defaultAvatar}/>
                            {
                                isAuthenticated?
                                <Typography style={{textAlign : 'center', fontWeight : 'bold', marginBottom : '1rem'}}>{name}</Typography>: null
                            }
                            <Divider/>
                            {
                                isAuthenticated === false ?
                                    <div>
                                        <ListItem button onClick={(e) => handleClick(e, 1)}>
                                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                                            <ListItemText primary={'Login'}/>
                                        </ListItem>
                                        <ListItem button onClick={(e) => handleClick(e, 2)}>
                                            <ListItemIcon><VpnKeyIcon/></ListItemIcon>
                                            <ListItemText primary={'Signup'} style={{marginRight: '4rem'}}/>
                                        </ListItem>
                                    </div>:
                                    <div>
                                        <ListItem button onClick={(e) => handleClick(e, 4)}>
                                            <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                                            <ListItemText primary={'My Profile'}/>
                                        </ListItem>
                                        <ListItem button onClick={(e) => handleClick(e, 3)}>
                                            <ListItemIcon><PostAddIcon/></ListItemIcon>
                                            <ListItemText primary={'Add post'} style={{marginRight: '4rem'}}/>
                                        </ListItem>
                                        <ListItem button onClick={(e) => handleClick(e, 5)}>
                                            <ListItemIcon><MeetingRoomIcon/></ListItemIcon>
                                            <ListItemText primary={'Logout'}/>
                                        </ListItem>
                                    </div>
                            }
                        </Drawer> :
                        <div className={classes.loginButton}>
                            {
                                isAuthenticated === false ?
                                    <div>
                                        <Button color="inherit" className={classes.link}
                                                onClick={(e) => handleClick(e, 1)}>
                                            Login
                                        </Button>
                                        <Button color="inherit" className={classes.link}
                                                onClick={(e) => handleClick(e, 2)}>
                                            Sign up
                                        </Button>
                                    </div> :
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <Button color="inherit" variant={'outlined'} className={classes.link}
                                                onClick={(e) => handleClick(e, 3)}>
                                            Add post
                                        </Button>
                                        <Button color="inherit" className={classes.link}
                                                onClick={(e) => handleClick(e, 4)}>
                                            My Profile
                                        </Button>
                                        <Button color="inherit" className={classes.link}
                                                onClick={(e) => handleClick(e, 5)}>
                                            Logout
                                        </Button>
                                    </div>
                            }
                        </div>
                }
            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;