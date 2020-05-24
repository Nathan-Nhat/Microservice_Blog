import React from 'react';
import {Typography, Divider, Box} from "@material-ui/core";
import defaultAvatar from '../../image/default_avatar.jpg'
import {makeStyles} from "@material-ui/core/styles";
import {get_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import ChatBubbleRoundedIcon from "@material-ui/icons/ChatBubbleRounded";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import {NavLink} from "react-router-dom";
import {theme} from "../../Themes";

const useStyle = makeStyles({
    container: {

    },
    title: {
        display: 'flex',
        flexDirection: 'row'
    },
    image: {
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '50%',
    },
     commentContainer: {
        display: "flex",
        flexDirection: 'row',
    },
    elementComment: {
        display: "flex",
        flexDirection: "row",
        paddingRight: "1rem",
        opacity: '0.3',
    },
    numComment: {
        fontSize: "1rem",
        paddingLeft: '0.2rem',
    },
    iconComment: {
        fontSize: "1rem",
        margin: 'auto',
    },
    titlePosts: {
        // fontWeight: "bold",
        fontSize: "1rem",
        color: 'black',
        textDecoration: "None",
        '&:hover': {
            color: theme.palette.primary
        }
    },
})
const PostPopularComponent = () => {
    const classes = useStyle()
    const [state, setState] = React.useState({
        isLoadding: true,
        posts: []
    })
    React.useEffect(() => {
        setState({...state, isLoadding: true})
        get_data(URL_POST_SERVICE + '/most_post', {}, false)
            .then(res => {
                setState({
                    ...state,
                    isLoadding: false,
                    posts: res.data.post
                })
            })
    }, [])
    return (
        <div className={classes.container}>
            <Typography style={{display: 'inline-block', fontSize: '1.2rem', color: theme.palette.primary.main}}>Popular Posts This Week</Typography>
            <Divider style={{margin: '0 0 0.7rem 0'}}/>
            {
                state.posts.map((post, index) => {
                    return (
                        <div style={{
                            overflow: 'hidden',

                        }}>
                            <NavLink to={`/post/${post.post_id}`} className = {classes.titlePosts}>{post.title}</NavLink>
                            <Box className={classes.commentContainer}>
                                <Box className={classes.elementComment}>
                                    <VisibilityRoundedIcon className={classes.iconComment}/>
                                    <Typography className={classes.numComment}>{post.num_views}</Typography>
                                </Box>
                                <Box className={classes.elementComment} style={post.is_liked ? {opacity: '1'} : {}}>
                                    <BookmarkIcon color={'inherit'}
                                                  className={classes.iconComment}/>
                                    <Typography className={classes.numComment}>{post.num_like}</Typography>
                                </Box>
                            </Box>
                            <NavLink to = {`/profile/${post.author.user_id}`} style={{fontSize: '0.8rem'
                                , opacity: '0.7',
                                color : theme.palette.primary.main
                            }}>{post.author.name}</NavLink>
                            <Divider style={{margin: '0.7rem 0 0.7rem 0'}}/>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default PostPopularComponent;