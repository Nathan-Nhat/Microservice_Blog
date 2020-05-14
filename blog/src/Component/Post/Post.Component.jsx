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
        marginTop : '0.5rem',
        flexDirection: 'row',
    },
    elementComment: {
        display: "flex",
        flexDirection: "row",
        marginRight: "1rem",
        opacity : '50%'
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
        display : 'flex',
        flexDirection : 'row',
    },
    writer: {
        fontSize: '1rem',
        color: 'blue',
        textDecoration: "None",
        '&:hover': {
            cursor: 'pointer'
        }
    },

})
const PostComponent = ({data}) => {
    const classes = useStyle(theme)
    return (
        // <Grow in={true}>
        <Box>
            <Box className={classes.container}>
                <img className={classes.image} src={data.author.avatar_hash}/>
                <Box className={classes.detail}>
                    <div align='left' className={classes.author}>
                        <NavLink className={classes.writer}
                                 to={`/profile/${data.author.user_id}`}>{data.author.name}</NavLink>
                        <div style={{flexGrow : 1}}></div>
                        <Typography style = {{fontSize : '0.9rem', fontStyle : 'italic'}}>{moment(data.date_post).fromNow()}</Typography>
                    </div>
                    <Box className={classes.containerTitle}>
                        <NavLink className={classes.title}
                                 to={`/post/${data.post_id}`}>{data.title}</NavLink>
                    </Box>
                    <Box className={classes.tagsContainer}>
                        {['python', 'data', 'font-end'].map((item, index) => {
                            return <a key={index} className={classes.tags} key={index}>{item}</a>
                        })}
                    </Box>
                    <Box className={classes.commentContainer}>
                        <Box className={classes.elementComment}>
                            <VisibilityRoundedIcon  className={classes.iconComment}/>
                            <Typography className={classes.numComment}>{data.num_views}</Typography>
                        </Box>
                        <Box className={classes.elementComment}>
                             <ChatBubbleRoundedIcon
                                                   className={classes.iconComment}/>
                            <Typography className={classes.numComment}>{data.num_comment}</Typography>
                        </Box>
                         <Box className={classes.elementComment} style={data.is_liked?{opacity : '100%'} : {}}>
                             <ThumbUpAltRoundedIcon color={data.is_liked ? 'primary' : ''}
                                                   className={classes.iconComment}/>
                            <Typography className={classes.numComment}>{data.num_like}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider/>
        </Box>
        // </Grow>
    );
};

export default PostComponent;