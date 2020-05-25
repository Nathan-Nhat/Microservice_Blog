import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, Typography, Divider} from "@material-ui/core";
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import {NavLink} from "react-router-dom";
import {theme} from "../../Themes";
import '../../Markdown.style.css'
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import moment from "moment";
import {useSelector} from "react-redux";
import {IconButton} from '@material-ui/core';
import {useHistory} from 'react-router-dom'
import * as API from '../../ApiCall'
import {URL_POST_SERVICE} from "../../Constants";
import {useMediaQuery, MenuList, MenuItem, Popover, Grow, Paper} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import BookmarkIcon from '@material-ui/icons/Bookmark';

const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "row",
        padding: "1rem 0.5rem 0.5rem 0"
    },
    image: {
        width: props => props.isMobile ? '2.5rem' : "3rem",
        height: props => props.isMobile ? '2.5rem' : "3rem",
        borderRadius: "50%",
        marginRight: '0.5rem'
    },
    detail: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: 'relative'
    },
    iconEdit: {
        position: 'absolute',
        right: 0
    },
    commentContainer: {
        display: "flex",
        paddingTop: '0.5rem',
        flexDirection: 'row',
    },
    elementComment: {
        display: "flex",
        flexDirection: "row",
        paddingRight: "1rem",
        opacity: '0.3',
    },
    numComment: {
        fontSize: props => props.isMobile ? '0.9rem' : "1rem",
        paddingLeft: '0.2rem',
    },
    iconComment: {
        fontSize: props => props.isMobile ? '0.9rem' : "1rem",
        margin: 'auto',
    },
    containerTitle: {
        textAlign: "left",
        paddingTop: '0.2rem',
    },
    title: {
        // fontWeight: "bold",
        fontSize: "1.1rem",
        color: 'black',
        textDecoration: "None",
        '&:hover': {
            color: theme.palette.primary
        }
    },
    tags: {
        display : 'inline-block',
        fontSize: '0.8rem',
        backgroundColor: '#dee3e0',
        borderRadius: "0.2rem",
        marginLeft : '0.5rem',
        padding: '0.1rem 0.2rem 0.1rem 0.2rem',
        border: '1px solid #d7d9d7',
        opacity: '0.5',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 2px 18px -8px rgba(0,0,0,0.75)',
            backgroundColor: '#d7d9d7'
        }
    },
    author: {
        display: 'flex',
        flexDirection: props => props.isMobile ? 'column' : 'row',
    },
    writer: {
        fontSize: '0.9rem',
        color: theme.palette.primary.dark,
        textDecoration: "None",
        paddingRight: '1rem',
        opacity: '1',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    namecontainer: {
        display: 'flex',
        flexDirection: 'row'
    }

})
const PostComponent = ({post, user}) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const classes = useStyle({isMobile})
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    const history = useHistory()
    const myRef = React.useRef('123')
    const [state, setState] = React.useState({
        isDeleted: false
    })
    const handleEdit = () => {
        history.push(`/edit_post/${post.post_id}`)
    }
    const handleDelete = () => {
        API.delete_data(URL_POST_SERVICE + `/${post.post_id}`, {}, true)
            .then(res => {
                setState({isDeleted: true})
            })
    }
    const [open, setOpen] = React.useState(false)
    const toggleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <Box>
            {state.isDeleted ? null :
                <Box className={classes.container}>
                    <img className={classes.image} src={user.avatar_hash} alt={''}/>
                    <Box className={classes.detail}>
                        <div align='left' className={classes.author}>
                            <div className={classes.namecontainer}>
                                <NavLink className={classes.writer}
                                         to={`/profile/${user.user_id}`}>{user.name}</NavLink>
                            </div>
                            {isMobile ? null :
                                <div style={{flexGrow: 1}}></div>
                            }
                            <Typography style={{
                                fontSize: '0.8rem',
                                opacity: '0.5',
                                marginRight: '1rem'
                            }}>{moment(post.date_post).fromNow()}</Typography>
                        </div>
                        <Box className={classes.containerTitle}>
                            <NavLink className={classes.title}
                                     to={`/post/${post.post_id}`}>{post.title}</NavLink>
                            {post.tags.map((item, index) => {
                                return <div key={index} className={classes.tags} key={index} onClick={() => {
                                    history.push(`/tag/${item.tag_id}`)
                                }}>{item.tag_name}</div>
                            })}
                        </Box>
                        <Box className={classes.commentContainer}>
                            <Box className={classes.elementComment}>
                                <VisibilityRoundedIcon className={classes.iconComment}/>
                                <Typography className={classes.numComment}>{post.num_views}</Typography>
                            </Box>
                            <Box className={classes.elementComment}>
                                <ChatBubbleRoundedIcon
                                    className={classes.iconComment}/>
                                <Typography className={classes.numComment}>{post.num_comment}</Typography>
                            </Box>
                            <Box className={classes.elementComment} style={post.is_liked ? {opacity: '1'} : {}}>
                                <BookmarkIcon color={post.is_liked ? 'primary' : 'inherit'}
                                                       className={classes.iconComment}/>
                                <Typography className={classes.numComment}>{post.num_like}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <div>
                            {isAuthenticated && id === user.user_id ?
                                <div>
                                    <IconButton ref={myRef} aria-controls={true ? 'menu-list-grow' : undefined}
                                                aria-haspopup="true" onClick={toggleOpen}
                                                size={'small'}>
                                        <KeyboardArrowDownIcon style={{fontSize: '1.5rem'}}/>
                                    </IconButton>
                                    <Popover open={open} anchorEl={myRef.current} role={undefined}
                                             disablePortal onClose={handleClose} anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                             transformOrigin={{
                                                 vertical: 'top',
                                                 horizontal: 'left',
                                             }}>
                                        <Grow in={true}>
                                            <Paper>
                                                <MenuList id="menu-list-grow">
                                                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                                </MenuList>
                                            </Paper>
                                        </Grow>
                                    </Popover>
                                </div> : null
                            }
                        </div>
                </Box>
            }
        </Box>
    );
};

export default PostComponent;