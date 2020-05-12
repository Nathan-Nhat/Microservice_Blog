import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, Typography, Divider} from "@material-ui/core";
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import {NavLink} from "react-router-dom";
import {theme} from "../../Themes";
import ReactMarkdown from "react-markdown/with-html";
import '../../Markdown.style.css'
import CodeBlock from "../../Helper/CodeBlock";
import Grow from '@material-ui/core/Grow';

const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "row",
        padding: "1rem"
    },
    image: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        margin: "1rem"
    },
    detail: {
        width: "100%",
        margin: "0.7rem 0",
        display: "flex",
        flexDirection: "column"
    },
    commentContainer: {
        display: "flex",
        flexDirection: 'row',
        margin: "0.5rem 0",
    },
    elementComment: {
        display: "flex",
        flexDirection: "row",
        marginRight: "0.5rem"
    },
    numComment: {
        fontSize: "0.7rem",
        marginRight: '0.3rem'
    },
    iconComment: {
        fontSize: "1rem"
    },
    containerTitle: {
        textAlign: "left"
    },
    title: {
        fontWeight: "bold",
        fontSize: "1.2rem",
        color: theme.palette.primary,
        textDecoration: "None",
    },
    tagsContainer: {
        marginTop: '0.5rem',
        display: "flex",
        flexDirection: 'row',
    },
    tags: {
        fontSize: '0.7rem',
        backgroundColor: '#dee3e0',
        borderRadius: "0.2rem",
        marginRight: "0.3rem",
        padding: '0.3rem',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 2px 18px -8px rgba(0,0,0,0.75)'
        }
    },
    author: {
        marginTop: "1rem",
        fontSize: '0.7rem'
    },
    writer: {
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
                    <img className={classes.image} src={data.author_avatar}/>
                    <Box className={classes.detail}>
                        <Box className={classes.containerTitle}>
                            <NavLink className={classes.title}
                                     to={`/post/${data.post_id}`}>{data.title}</NavLink>
                        </Box>
                        <Box className={classes.tagsContainer}>
                            {['python', 'data', 'font-end'].map((item, index) => {
                                return <a key={index} className={classes.tags} key={index}>{item}</a>
                            })}
                        </Box>
                        <Typography align='left' className={classes.author}>
                            <NavLink className={classes.writer}
                                     to={`/profile/${data.author_id}`}>{data.author_name}</NavLink> write at
                            date {data.date_post}
                        </Typography>
                    </Box>
                    <Box className={classes.commentContainer}>
                        <Box className={classes.elementComment}>
                            <Typography className={classes.numComment}>{data.num_comment}</Typography>
                            <ChatBubbleRoundedIcon className={classes.iconComment}/>
                        </Box>
                        <Box className={classes.elementComment}>
                            <Typography className={classes.numComment}>{data.num_like}</Typography>
                            <ThumbUpAltRoundedIcon color= {data.is_liked?'primary': 'action'}  className={classes.iconComment}/>
                        </Box>
                    </Box>
                </Box>
                <Divider/>
            </Box>
        // </Grow>
    );
};

export default PostComponent;