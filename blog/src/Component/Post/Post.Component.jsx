import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, Typography, Divider} from "@material-ui/core";
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
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
        marginRight : "0.5rem"
    },
    numComment: {
        fontSize: "0.7rem",
        marginRight : '0.3rem'
    },
    iconComment: {
        fontSize: "1rem"
    },
    title: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#99c9ad"
    },
    tagsContainer: {
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
    summary: {
        marginTop: '0.5rem'
    },
    author: {
        marginTop: "1rem",
        fontSize: '0.7rem'
    },
    writer: {
        color: 'blue',
        '&:hover': {
            cursor: 'pointer'
        }
    }
})
const PostComponent = ({data}) => {
    const classes = useStyle()
    return (
        <Box>
            <Box className={classes.container}>
                <img className={classes.image} src='https://i.stack.imgur.com/l60Hf.png'/>
                <Box className={classes.detail}>
                    <Typography align="left" className={classes.title}><a>{data.title.split('.')[0]}</a></Typography>
                    <Box style={{flexGrow: 1}}></Box>
                    <Box className={classes.tagsContainer}>
                        {['python', 'data', 'font-end'].map((item, index) => {
                            return <a key = {index} className={classes.tags} key={index}>{item}</a>
                        })}
                    </Box>
                    <Typography align={'left'} className={classes.summary}>{data.body_summary}</Typography>
                    <Typography align='left' className={classes.author}>
                        <i className={classes.writer}>{data.author_username}</i> write at date {data.date_post}
                    </Typography>
                </Box>
                <Box className={classes.commentContainer}>
                    <Box className={classes.elementComment}>
                        <Typography className={classes.numComment}>100</Typography>
                        <ChatBubbleRoundedIcon className={classes.iconComment}/>
                    </Box>
                    <Box className={classes.elementComment}>
                        <Typography className={classes.numComment}>100</Typography>
                        <ThumbUpAltRoundedIcon className={classes.iconComment}/>
                    </Box>
                </Box>
            </Box>
            <Divider/>
        </Box>
    );
};

export default PostComponent;