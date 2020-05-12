import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {Box, Typography, CircularProgress} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {get_data} from "../ApiCall";
import {URL_POST_SERVICE, URL_PROFILE_SERVICE} from "../Constants";
import {NavLink} from "react-router-dom";
import ReactMarkdown from "react-markdown/with-html";
import '../Markdown.style.css'
import CodeBlock from "../Helper/CodeBlock";
import CommentComponents from "../Component/Post/Comment.Components";
import Divider from "@material-ui/core/Divider";
import Fade from '@material-ui/core/Fade';
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import * as API from "../ApiCall";
import {useHistory} from 'react-router-dom'
const useStyle = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        marginTop:'2rem'
    },
    main: {
        padding: '2rem',
        width: '80%',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
    },
    tableContent: {
        alignSelf : 'flex-start',
        padding: '2rem',
        width: "20%",
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        float : 'right',
        position : 'sticky',
        top : 0
    },
    title: {
        textAlign: 'left',
        fontWeight: "bold"
    },
    tagsContainer: {
        textAlign: "left",
        marginTop: "2rem"
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
        marginBottom: '3rem'
    },
    image: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        marginRight: "1rem"
    },

    body: {
        marginTop: "2.5rem",
        textAlign: "left"
    },
    authorDetails: {
        display: 'flex',
        flexDirection: 'column'
    },
    name: {
        textDecoration: 'None',
        fontSize: '1rem',
        lineHeight: '1.6rem',
        textAlign: 'center',
        fontWeight: 'bold',
        display: 'inline-block'
    },
    followBtn: {
        fontSize: "0.8rem",
        lineHeight: '0.8rem',
        display: 'inline-block',
        marginLeft: '1rem'
    },
    followGrp: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: '1rem'
    },

})
const SinglePostPage = () => {
    const {post_id} = useParams()
    const [state, setState] = useState({
        is_followed: false,
        isLoading: false,
        data: {
            title: 'Title',
            tag: ['python', 'data science', 'java'],
            body: 'Body',
            date_post: '20/3/2020',
            num_like: 0,
            num_comment: 0,
            is_liked: false,
            author: {
                user_id: 0,
                name: 'N/A',
                avatar_hash: null,
                number_follower: 0,
                number_posts: 0
            }
        },
    })
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    const classes = useStyle()
    const history = useHistory()
    useEffect(() => {
        setState({...state, isLoading: true})
        let params = isAuthenticated ? {user_current_id: id} : {}
        get_data(URL_POST_SERVICE + `/${post_id}`, params, false)
            .then(res => {
                console.log(res.data)
                setState({
                    is_followed: res.data.author.is_followed,
                    isLoading: false,
                    data: {
                        title: res.data.title,
                        tag: ['python', 'data science', 'java'],
                        body: res.data.body_html,
                        date_post: res.data.date_post,
                        is_liked: res.data.is_liked,
                        num_comment: res.data.num_comment,
                        num_like: res.data.num_like,
                        author: {
                            user_id: res.data.author.user_id,
                            name: res.data.author.name,
                            avatar_hash: res.data.author.avatar_hash,
                            number_follower: res.data.author.number_follower,
                            number_posts: res.data.author.num_posts,
                        }
                    }
                })
            })
    }, [])
    const handleFollow = () => {
        if (!isAuthenticated) {
            history.push({pathname: '/login', state: {nextUrl: `/post/${post_id}`}})
        } else {
            API.post_data(URL_PROFILE_SERVICE + '/follow', {user_follow: state.data.author.user_id}, null, true)
                .then(res => setState({
                    ...state,
                    data: {
                        ...state.data,
                        author: {
                            ...state.data.author,
                            number_follower: state.data.author.number_follower + 1
                        },
                    },
                    is_followed: true
                }))
                .catch(error => console.log(error))
        }
    }

    const handleUnFollow = () => {
        API.delete_data(URL_PROFILE_SERVICE + '/follow', {user_follow: state.data.author.user_id}, true)
            .then(res => {
                console.log(res)
                setState({
                    ...state,
                    data: {
                        ...state.data,
                        author: {
                            ...state.data.author,
                            number_follower: state.data.author.number_follower - 1
                        },
                    },
                    is_followed: false
                })
            })
            .catch(error => console.log(error))
    }
    return (
        // <Fade in={true}>
        <div className={classes.root}>
            <div className={classes.main}>
                {
                    state.isLoading === true ? <CircularProgress style={{marginTop: "3rem"}}/> :
                        <Box className={classes.container}>
                            <Box className={classes.author}>
                                <img className={classes.image} src={state.data.author.avatar_hash}/>
                                <Box className={classes.authorDetails}>
                                    <Box>
                                        <NavLink className={classes.name}
                                                 to={`/profile/${state.data.author.user_id}`}>{state.data.author.name}</NavLink>
                                        {parseInt(state.data.author.user_id) === id ? null :
                                            state.is_followed === false ?
                                                <Button variant={'outlined'} className={classes.followBtn}
                                                        onClick={handleFollow}>Follow</Button> :
                                                <Button variant={'contained'} color='primary'
                                                        className={classes.followBtn}
                                                        onClick={handleUnFollow}>Following</Button>
                                        }
                                    </Box>
                                    <Box style={{display: 'flex', flexDirection: 'row', opacity: '50%'}}>
                                        <Box className={classes.followGrp}>
                                            <GroupAddRoundedIcon style={{marginRight: '0.2rem'}}/>
                                            <Typography>{state.data.author.number_follower}</Typography>
                                        </Box>
                                        <Box className={classes.followGrp}>
                                            <CreateRoundedIcon style={{marginRight: '0.2rem'}}/>
                                            <Typography>{state.data.author.number_posts}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <div style={{flexGrow: 1}}></div>
                                <Typography style={{opacity: "50%"}}>{state.data.date_post}</Typography>
                            </Box>
                            <Typography color="primary" variant={'h3'}
                                        className={classes.title}>{state.data.title}</Typography>
                            <Box className={classes.tagsContainer}>
                                {state.data.tag.map((item, index) => {
                                    return <a key={index} className={classes.tags} key={index}>{item}</a>
                                })}
                            </Box>
                            <ReactMarkdown className="markdown" source={state.data.body}
                                           renderers={{code: CodeBlock}} escapeHtml={false}/>
                        </Box>
                }
                <Divider/>
                <CommentComponents post_id={post_id}/>
            </div>
            <div className={classes.tableContent}>
                <Typography>TABLE OF CONTENTS
Have no Table of contents

Announcements
Hé lộ thông tin về diễn giả thứ hai của sự kiện Viblo Deployment Day
Viblo team

Công bố những phản hồi đầu tiên của Viblo Technical Survey 2019
Viblo team

Đăng ký tham gia hội thảo "Practical implementation of recommendation based on machine learning"
Viblo team

Viblo loves Machine Learning
Viblo team

Đi tắt, đón đầu những xu hướng công nghệ mới cùng Vietnam Mobile Day 2018</Typography>

            </div>
        </div>
        // </Fade>
    );
};

export default SinglePostPage;