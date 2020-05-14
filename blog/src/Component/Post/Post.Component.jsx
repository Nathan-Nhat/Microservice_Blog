import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, Typography, Divider} from "@material-ui/core";
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import {NavLink} from "react-router-dom";
import {theme} from "../../Themes";
import '../../Markdown.style.css'
import Grow from '@material-ui/core/Grow';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import moment from "moment";
import {useSelector} from "react-redux";
import {IconButton} from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import {green} from '@material-ui/core/colors';
import {useHistory} from 'react-router-dom'
import * as API from '../../ApiCall'
import {URL_POST_SERVICE} from "../../Constants";

const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "row",
        padding: "1rem 1rem 0.5rem 1rem"
    },
    image: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        margin: "1rem"
    },
    detail: {
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    commentContainer: {
        display: "flex",
        marginTop: '0.5rem',
        flexDirection: 'row',
    },
    elementComment: {
        display: "flex",
        flexDirection: "row",
        marginRight: "1rem",
        opacity: '50%'
    },
    numComment: {
        fontSize: "1rem",
        marginLeft: '0.2rem'
    },
    iconComment: {
        fontSize: "1rem",
        margin: 'auto',
    },
    containerTitle: {
        textAlign: "left",
    },
    title: {
        // fontWeight: "bold",
        fontSize: "1.3rem",
        color: 'black',
        textDecoration: "None",
        '&:hover': {
            color: theme.palette.primary
        }
    },
    tagsContainer: {
        marginTop: '0.5rem',
        display: "flex",
        flexDirection: 'row',
    },
    tags: {
        fontSize: '0.7rem',
        backgroundColor: '#dee3e0',
        borderRadius: "0.4rem",
        marginRight: "0.7rem",
        padding: '0.3rem',
        border: '1px solid #d7d9d7',
        opacity: '70%',
        lineHeight: '0.7rem',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 2px 18px -8px rgba(0,0,0,0.75)',
            backgroundColor: '#d7d9d7'
        }
    },
    author: {
        display: 'flex',
        flexDirection: 'row',
    },
    writer: {
        fontSize: '0.8rem',
        color: 'blue',
        textDecoration: "None",
        lineHeight: '2.1rem',
        marginRight: '1rem',
        '&:hover': {
            cursor: 'pointer'
        }
    },

})
const PostComponent = ({post, user}) => {
    const classes = useStyle(theme)
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    const history = useHistory()
    const [state, setState] = React.useState({
        isDeleted: false
    })
    const handleEdit = () => {
        history.push(`/edit_post/${post.post_id}`)
    }
    const handleDelete = () => {
        API.delete_data(URL_POST_SERVICE + `/${post.post_id}`, {}, true)
            .then(res => {
                console.log(res)
                setState({isDeleted: true})
            })
    }
    return (
        // <Grow in={true}>
        <Box>
            { state.isDeleted? null :
                <Box>
                    <Box className={classes.container}>
                        <img className={classes.image} src={user.avatar_hash}/>
                        <Box className={classes.detail}>
                            <div align='left' className={classes.author}>
                                <NavLink className={classes.writer}
                                         to={`/profile/${user.user_id}`}>{user.name}</NavLink>
                                {isAuthenticated && id === user.user_id ?
                                    <Box>
                                        <IconButton style={{padding: '0.3rem', marginRight: '0.5rem'}}
                                                    onClick={handleEdit}>
                                            <EditRoundedIcon style={{fontSize: '1.4rem', color: green[500]}}/>
                                        </IconButton>
                                        <IconButton style={{padding: '0.3rem', marginRight: '0.5rem'}}
                                                    onClick={handleDelete}>
                                            <DeleteForeverRoundedIcon color='secondary' style={{fontSize: '1.4rem'}}/>
                                        </IconButton>
                                    </Box> : null
                                }
                                <div style={{flexGrow: 1}}></div>
                                <Typography style={{
                                    fontSize: '0.8rem',
                                    fontStyle: 'italic'
                                }}>{moment(post.date_post).fromNow()}</Typography>
                            </div>
                            <Box className={classes.containerTitle}>
                                <NavLink className={classes.title}
                                         to={`/post/${post.post_id}`}>{post.title}</NavLink>
                            </Box>
                            <Box className={classes.tagsContainer}>
                                {['python', 'data', 'font-end'].map((item, index) => {
                                    return <a key={index} className={classes.tags} key={index}>{item}</a>
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
                                <Box className={classes.elementComment} style={post.is_liked ? {opacity: '100%'} : {}}>
                                    <ThumbUpAltRoundedIcon color={post.is_liked ? 'primary' : ''}
                                                           className={classes.iconComment}/>
                                    <Typography className={classes.numComment}>{post.num_like}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Divider/>
                </Box>
            }
        </Box>
        // </Grow>
    );
};

export default PostComponent;