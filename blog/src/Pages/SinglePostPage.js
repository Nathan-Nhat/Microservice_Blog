import React, {useState, useEffect, useRef} from 'react';
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
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import * as API from "../ApiCall";
import {useHistory} from 'react-router-dom'
import PostRightComponent from "../Component/Post/PostRight.Component";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../Themes";
import BookmarkIcon from "@material-ui/icons/Bookmark";

const useStyle = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: props => props.isMobile ? '1rem' : '2rem',
    },
    main: {
        padding: props => props.isMobile ? '1rem' : '2rem',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        width: '100%',
    },
    title: {
        textAlign: 'left',
        fontWeight: "bold",
        lineHeight: props => props.isMobile ? '2.3rem' : '3rem',
        fontSize: props => props.isMobile ? '1.7rem' : '2rem',
    },
    tagsContainer: {
        textAlign: "left",
        paddingTop: props => props.isMobile ? '1rem' : "2rem",
    },
    tags: {
        fontSize: '0.8rem',
        backgroundColor: '#dee3e0',
        borderRadius: "0.2rem",
        marginRight: "0.8rem",
        padding: '0.4rem',
        opacity: "0.7",
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0px 2px 18px -8px rgba(0,0,0,0.75)'
        }
    },
    author: {
        display: "flex",
        flexDirection: props => props.isMobile ? 'column' : "row",
        paddingBottom: props => props.isMobile ? '1rem' : '3rem'
    },
    image: {
        width: '3rem',
        height: '3rem',
        borderRadius: "50%",
        marginRight: props => props.isMobile ? "0.5rem" : '1rem',
        gridRowStart: 1,
        gridRowEnd: 3
    },

    body: {
        paddingTop: "2.5rem",
        textAlign: "left"
    },
    authorButton: {
        display: 'inline-grid',
        gridTemplateColumns: 'auto auto auto',
        alignSelf: 'flex-start'
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
        paddingRight: '1rem'
    },
    datePost: {
        opacity: "0.5",
        textAlign: props => props.isMobile ? 'left' : "right",
        paddingTop: props => props.isMobile ? '1rem' : "0"
    },
    likeMobile: {
        color: props => props.state.data.is_liked ? theme.palette.primary.dark : 'black',
        opacity: props => props.state.data.is_liked ? 1 : 0.5,
        '&:hover' : {
            cursor : 'pointer'
        }
    }
})
const SinglePostPage = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const {post_id} = useParams()
    const [state, setState] = useState({
        list_contents: [],
        is_followed: false,
        isLoading: true,
        data: {
            title: 'Title',
            tag: [],
            body: 'Body',
            date_post: '20/3/2020',
            num_like: 0,
            num_comment: 0,
            num_views: 0,
            is_liked: false,
            author: {
                user_id: 0,
                name: 'N/A',
                avatar_hash: null,
                number_follower: 0,
                number_posts: 0,
            }
        },
    })
    useEffect(() => {
        if (state.isLoading === false) {
            let list = Array.from(ref.current.querySelectorAll('h1, h2'))
            setState({...state, list_contents: list})
        }

    }, [state.isLoading])
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    const classes = useStyle({isMobile, state})
    const history = useHistory()
    const ref = useRef('123')
    useEffect(() => {
        setState({...state, isLoading: true})
        let params = isAuthenticated ? {user_current_id: id} : {}
        get_data(URL_POST_SERVICE + `/${post_id}`, params, false)
            .then(res => {
                setState({
                    ...state,
                    is_followed: res.data.author.is_followed,
                    isLoading: false,
                    data: {
                        title: res.data.title,
                        tag: res.data.tags,
                        body: res.data.body_html,
                        date_post: res.data.date_post,
                        is_liked: res.data.is_liked,
                        num_comment: res.data.num_comment,
                        num_like: res.data.num_like,
                        num_views: res.data.num_views,
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
                .catch(error => {
                })
        }
    }

    const handleUnFollow = () => {
        API.delete_data(URL_PROFILE_SERVICE + '/follow', {user_follow: state.data.author.user_id}, true)
            .then(res => {
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
            .catch(error => {
            })
    }

    const toggole_like = () => {
        if (!isAuthenticated) {
            history.push({pathname: '/login', state: {nextUrl: `/post/${post_id}`}})
        } else if (!state.data.is_liked) {
            API.post_data(URL_POST_SERVICE + `/${post_id}/like`, {}, null, true)
                .then(res => setState({
                    ...state,
                    data: {
                        ...state.data,
                        num_like: state.data.num_like + 1,
                        is_liked: true
                    }
                }))
        } else {
            API.delete_data(URL_POST_SERVICE + `/${post_id}/like`, {}, true)
                .then(res => setState({
                    ...state,
                    data: {
                        ...state.data,
                        num_like: state.data.num_like - 1,
                        is_liked: false
                    }
                }))
        }
    }

        return (
            <div>
                {state.isLoading === true ? <div></div> :
                    <div className={classes.root}>
                        <div className={classes.main}>
                            <Box className={classes.container}>
                                <Box className={classes.author}>
                                    <Box className={classes.authorButton}>
                                        <img className={classes.image} src={state.data.author.avatar_hash} alt={''}/>
                                        <NavLink className={classes.name}
                                                 to={`/profile/${state.data.author.user_id}`}>{state.data.author.name}</NavLink>
                                        {parseInt(state.data.author.user_id) === id ? <div></div> :
                                            state.is_followed === false || !isAuthenticated ?
                                                <Button variant={'outlined'} className={classes.followBtn}
                                                        onClick={handleFollow}>Follow</Button> :
                                                <Button variant={'contained'} color='primary'
                                                        className={classes.followBtn}
                                                        onClick={handleUnFollow}>Following</Button>
                                        }

                                        <Box style={{display: 'flex', flexDirection: 'row', opacity: '0.5'}}>
                                            <Box className={classes.followGrp}>
                                                <GroupAddRoundedIcon style={{paddingRight: '0.2rem'}}/>
                                                <Typography>{state.data.author.number_follower}</Typography>
                                            </Box>
                                            <Box className={classes.followGrp}>
                                                <CreateRoundedIcon style={{paddingRight: '0.2rem'}}/>
                                                <Typography>{state.data.author.number_posts}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {
                                        isMobile ? null :
                                            <div style={{flexGrow: 1}}></div>
                                    }
                                    <div>
                                        <Typography
                                            className={classes.datePost}>{state.data.date_post}</Typography>
                                        <div style={{display: 'flex', flexDirection: "row", opacity: "1"}}>
                                            {isMobile ? null : <div style={{flexGrow: 1}}></div>}
                                            <VisibilityIcon style={{paddingRight: "0.3rem", opacity: 0.5}}/>
                                            <Typography style={{
                                                paddingRight: "0.5rem",
                                                opacity: 0.5
                                            }}>{state.data.num_views}</Typography>
                                            {
                                                isMobile ?
                                                    <BookmarkIcon className={classes.likeMobile} onClick={toggole_like}
                                                    /> : null
                                            }
                                            {
                                                isMobile?
                                                <Typography style={{
                                                paddingRight: "0.5rem",
                                                opacity: state.data.is_liked? '1' : '0.5', color : state.data.is_liked?theme.palette.primary.dark :'black'
                                            }}>{state.data.num_like}</Typography> : null
                                            }
                                        </div>
                                    </div>
                                </Box>
                                <Typography
                                    className={classes.title}>{state.data.title}</Typography>
                                <Box className={classes.tagsContainer}>
                                    {state.data.tag.map((item, index) => {
                                        return <a key={index} className={classes.tags} key={index} onClick={() => {
                                            history.push(`/tag/${item.tag_id}`)
                                        }}>{item.tag_name}</a>
                                    })}
                                </Box>
                                <div ref={ref}>
                                    <ReactMarkdown className="markdown" source={state.data.body}
                                                   renderers={{code: CodeBlock}} escapeHtml={false}/>
                                </div>
                            </Box>
                            <Divider/>
                            <CommentComponents post_id={post_id}/>
                        </div>
                        {
                            isMobile ? null :
                                <PostRightComponent parentData={state} post_id={post_id} toggle_like={toggole_like}/>
                        }
                    </div>}
            </div>
        );
    };

    export default SinglePostPage;