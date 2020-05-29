import React from 'react';
import {Box, Button, useMediaQuery} from "@material-ui/core";
import {get_data, post_data} from "../../ApiCall";
import {URL_AUTH_SERVICE, URL_POST_SERVICE} from "../../Constants";
import {Typography, makeStyles, Divider} from "@material-ui/core";
import {useSelector} from "react-redux";
import {NavLink} from 'react-router-dom';
import moment from "moment";
import {theme} from "../../Themes";
import SingleCommentComponent from './SingleComment.Components'
import {func} from "prop-types";

const useStyle = makeStyles({
    container: {},
    commentContainer: {
        padding: props => props.isMobile ? 0 : '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        '&>*': {
            paddingTop: '1rem'
        }
    },
    text_area: {
        width: "100%",
        height: '4rem',
        borderRadius: '0.2rem',
        boxSizing: 'border-box',
        padding: '0.5rem'
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
})

const CommentComponents = ({post_id}) => {
    const [state, setState] = React.useState({
        page: 1,
        isFinished: false,
        list_comment: []
    })
    const [comment, setComment] = React.useState('')
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setComment(value)
    }

    const addComment = () => {
        var data = {
            body: comment,
            post_id: post_id,
        }
        post_data(URL_POST_SERVICE + '/comments', {}, data, true)
            .then(res => {
                var new_list = state.list_comment
		setComment('')
                new_list.unshift(res.data)
                setState({
                    ...state,
                    list_comment: new_list
                })
            })
    }
    const {isAuthenticated, id} = useSelector(state => state.AuthenReducer)
    React.useEffect(() => {
        get_data(URL_POST_SERVICE + `/comments/${post_id}`, {
            page: state.page, item_per_page: 5,
            current_user_id: isAuthenticated ? id : 0
        }, false)
            .then(res => {
                let isDone = false
                if (state.page === 1 && res.data.total === 1) isDone = true
                setState({
                        ...state,
                        isFinished: isDone,
                        list_comment: res.data.comments
                    }
                )
            })
    }, [])
    const changeLike = (comment_id, number_like, value) => {
        let newList = state.list_comment.map((item, index) => {
            if (item.comment_id === comment_id) {
                item.number_like = number_like
                item.is_liked = value
            }
            return item
        })
        setState({
            ...state,
            list_comment: newList
        })
    }
    const handlePage = (e) => {
        let newVal = state.page + 1
        get_data(URL_POST_SERVICE + `/comments/${post_id}`, {
            page: newVal, item_per_page: 5,
            current_user_id: isAuthenticated ? id : 0
        }, false)
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

    return (
        <div className={classes.container}>
            <Typography variant={'h5'}>Comments</Typography>
            <div className={classes.commentContainer}>
                {isAuthenticated === true ?
                    <div>
                    <textarea className={classes.text_area} value={comment} name='comment' onChange={handleChange}
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
                                <SingleCommentComponent key={item.comment_id} item={item} post_id={post_id}
                                                        changeLike={changeLike}/>
                            )
                        })
                    }
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
