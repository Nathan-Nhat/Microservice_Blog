import React from 'react';
import {Box, Button, useMediaQuery} from "@material-ui/core";
import {get_data, post_data} from "../../ApiCall";
import {URL_AUTH_SERVICE, URL_POST_SERVICE} from "../../Constants";
import {Typography, makeStyles, Divider} from "@material-ui/core";
import {useSelector} from "react-redux";
import {NavLink} from 'react-router-dom';
import moment from "moment";
import {theme} from "../../Themes";

const useStyle = makeStyles({
    container: {},
    commentContainer: {
        padding: props => props.isMobile? 0: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        '&>*': {
            paddingTop: '1rem'
        }
    },
    text_area: {
        width: "100%",
        height: '3rem',
        borderRadius: '0.2rem',
        boxSizing:'border-box'
    },
    addButton: {
        float: 'right'
    },
    loadMore: {
        fontSize: '0.8rem',
        fontStyle: 'italic',
        color: "blue",
        '&:hover': {
            cursor: 'pointer'
        }
    },
    wrapComment: {
        display: 'flex',
        flexDirection: 'row',
        padding: '1rem 0 1rem 0'
    },
    image: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
    },
    textComment: {
        paddingLeft: '1rem',
        width: '100%',
    },
    titleComment: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    date: {
        fontStyle: 'italic',
        fontSize: '0.8rem'
    },
    name: {
        color: 'blue',
        fontWeight: 'bold',
    },
    navLink: {
        textDecoration: 'none'
    }

})
const CommentComponents = ({post_id}) => {
    const [state, setState] = React.useState({
        page: 0,
        comment: '',
        isFinished: false,
        list_comment: []
    })
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setState({
            ...state,
            [name]: value
        })
    }

    const addComment = () => {
        var data = {
            body: state.comment,
            post_id: post_id,
        }
        post_data(URL_POST_SERVICE + '/comments', {}, data, true)
            .then(res => {
                var new_list = state.list_comment
                new_list.unshift(res.data)
                setState({
                    ...state,
                    comment: '',
                    list_comment: new_list
                })
            })
    }
    const {isAuthenticated, id} = useSelector(state => state.AuthenReducer)
    React.useEffect(() => {
        get_data(URL_POST_SERVICE + `/comments/${post_id}`, {page: state.page, item_per_page: 5,
            current_user_id: isAuthenticated? id : 0
        }, false)
            .then(res => {
                let isDone = false
                if (state.page === 0 && res.data.total === 1) isDone = true
                setState({
                        ...state,
                        isFinished: isDone,
                        list_comment: res.data.comments
                    }
                )
            })
    }, [])
    const handlePage = (e) => {
        let newVal = state.page + 1
        get_data(URL_POST_SERVICE + `/comments/${post_id}`, {page: newVal, item_per_page: 5}, false)
            .then(res => {
                let newList = state.list_comment.concat(res.data.comments)
                let isDone = false
                if (newVal === res.data.total) isDone = true
                setState({
                        ...state,
                        page: newVal,
                        isFinished: isDone,
                        list_comment: newList
                    }
                )
            })
    }
    const handleLike =(e, comment_id)=>{
        console.log(comment_id)
        post_data(URL_POST_SERVICE+ `/comments/${comment_id}/like`, {}, {}, true)
            .then(res=>console.log(res))

    }
    return (
        <div className={classes.container}>
            <Typography variant={'h5'}>Comments</Typography>
            <div className={classes.commentContainer}>
                {isAuthenticated === true ?
                    <div>
                    <textarea className={classes.text_area} value={state.comment} name='comment' onChange={handleChange}
                              placeholder={'Leave a comment here...'}></textarea>
                        <div>
                            <Button color='primary' className={classes.addButton} variant={'contained'}
                                    onClick={addComment}>Add
                                comment</Button>
                        </div>
                    </div> :
                    <Typography>Please <NavLink to={'/login'}>login</NavLink> to leave a comment!</Typography>
                }
                <div>
                    {
                        state.list_comment.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Divider/>
                                    <div className={classes.wrapComment}>
                                        <img className={classes.image} src={item.user_comment.avatar_hash} alt={''}/>
                                        <div className={classes.textComment}>
                                            <div className={classes.titleComment}>
                                                <Typography className={classes.name}><NavLink className = {classes.navLink}
                                                    to={`/profile/${item.user_comment.user_id}`}>{item.user_comment.name}</NavLink></Typography>
                                                <Typography
                                                    className={classes.date}>{moment(item.date_comment).fromNow()}</Typography>
                                            </div>
                                            <Typography className={classes.body}>{item.body_html}</Typography>
                                            <Button variant={item.is_liked? 'contained' : 'outlined'} color = 'primary'
                                                    onClick={(e)=>handleLike(e, item.comment_id)}>Like</Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Divider/>
                    {
                        state.isFinished ? <Box>
                                <Typography className={classes.loadMore}> </Typography>
                            </Box> :
                            <Box>
                                <Typography className={classes.loadMore} onClick={handlePage}>Load more...</Typography>
                            </Box>}
                </div>
            </div>
        </div>
    );
};

export default CommentComponents;