import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {Box, Typography, CircularProgress} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {get_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {NavLink} from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html";
import '../Markdown.style.css'
import CodeBlock from "../Helper/CodeBlock";
import CommentComponents from "../Component/Post/Comment.Components";
import Divider from "@material-ui/core/Divider";
const useStyle = makeStyles({
    container: {},
    title: {
        textAlign: 'left',
        fontWeight:"bold"
    },
    tagsContainer: {
        textAlign: "left",
        marginTop: "1rem"
    },
    tags: {
        fontSize: '0.8rem',
        backgroundColor: '#dee3e0',
        borderRadius: "0.2rem",
        marginRight: "0.8rem",
        padding: '0.4rem',
        opacity: "70%",
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 2px 18px -8px rgba(0,0,0,0.75)'
        }
    },
    author: {
        display: "flex",
        flexDirection: "row",
        marginTop: "1.5rem"
    },
    image: {
        width: "1.6rem",
        height: "1.6rem",
        borderRadius: "50%",
        marginRight: "1rem"
    },
    textAuthor: {
        fontSize: "0.8rem",
        opacity: "70%",
        height: '1.6rem',
        lineHeight: '1.6rem',
        textAlign: 'center'
    },
    body: {
        marginTop: "2.5rem",
        textAlign: "left"
    }
})
const SinglePostPage = () => {
    const {post_id} = useParams()
    const [state, setState] = useState({
        isLoading: false,
        data: {
            title: 'Title',
            tag: ['python', 'data science', 'java'],
            body: 'Body',
            author_name: 'Tran Trung Nhat',
            date_post: '20/3/2020',
            author_id: 123,
            author_avatar : ''
        },
    })
    const classes = useStyle()
    useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/${post_id}`, false)
            .then(res => {
                console.log(res.data.author_avatar)
                setState({
                    isLoading: false,
                    data: {
                        title: res.data.title,
                        tag: ['python', 'data science', 'java'],
                        body: res.data.body_html,
                        author_name: res.data.author_name,
                        date_post: res.data.date_post,
                        author_id: res.data.author_id,
                        author_avatar: res.data.author_avatar
                    }
                })
            })
    }, [])
    return (
        <div>
            {
                state.isLoading === true ? <CircularProgress style={{marginTop: "3rem"}}/> :
                    <Box className={classes.container}>
                        <Typography color = "primary" variant={'h4'} className={classes.title}>{state.data.title.split('.')[0]}</Typography>
                        <Box className={classes.tagsContainer}>
                            {state.data.tag.map((item, index) => {
                                return <a key={index} className={classes.tags} key={index}>{item}</a>
                            })}
                        </Box>
                        <Box className={classes.author}>
                            <img className={classes.image} src={state.data.author_avatar}/>
                            <Typography className={classes.textAuthor}><NavLink to={`/profile/${state.data.author_id}`}>{state.data.author_name}</NavLink> wrote
                                at {state.data.date_post}
                            </Typography>
                        </Box>
                        <ReactMarkdown className="markdown" source={state.data.body}
                                      renderers={{code :CodeBlock}} escapeHtml={false}/>
                    </Box>
            }
            <Divider/>
            <CommentComponents post_id={post_id}/>
        </div>
    );
};

export default SinglePostPage;