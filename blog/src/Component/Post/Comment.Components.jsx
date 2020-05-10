import React from 'react';
import {Box, Button} from "@material-ui/core";
import {get_data, post_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import {Typography, makeStyles, Divider} from "@material-ui/core";
import {useSelector} from "react-redux";
import {NavLink} from 'react-router-dom';
const useStyle = makeStyles({
    container: {},
    commentContainer: {
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        '&>*': {
            marginTop: '1rem'
        }
    },
    text_area: {
        width: "100%",
        height: '3rem',
        borderRadius: '0.2rem'
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
        padding: '1rem'
    },
    image: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
    },
    textComment: {
        marginLeft: '1rem',
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
        '&:hover': {
            cursor: 'pointer'
        }
    }

})
const CommentComponents = ({post_id}) => {
    const [state, setState] = React.useState({
        page: 0,
        comment: '',
        isFinished: false,
        list_comment: []
    })
    const classes = useStyle()
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
        post_data(URL_POST_SERVICE + '/comments', data, true)
            .then(res => {
                console.log(res.data)
                var new_list = state.list_comment
                new_list.unshift(res.data)
                setState({
                    comment: '',
                    list_comment: new_list
                })
            })
    }
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    React.useEffect(() => {
        get_data(URL_POST_SERVICE + `/comments/${post_id}?page=${state.page}&item_per_page=${5}`, false)
            .then(res => {
                let isDone = false
                if (state.page === 0 && res.data.total === 1) isDone = true
                setState({
                        ...state,
                        isFinished: isDone,
                        list_comment: res.data.comments
                    }
                )
                console.log(res.data)
            })
    }, [])
    const handlePage = (e) => {
        let newVal = state.page + 1
        get_data(URL_POST_SERVICE + `/comments/${post_id}?page=${newVal}&item_per_page=${5}`, false)
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
                console.log(res.data)
            })
    }
    return (
        <div className={classes.container}>
            <Typography variant={'h5'}>Comments</Typography>
            <div className={classes.commentContainer}>
                { isAuthenticated === true?
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
                {
                    state.isFinished ? <Box>
                            <Typography className={classes.loadMore}> </Typography>
                        </Box> :
                        <Box>
                            <Typography className={classes.loadMore} onClick={handlePage}>Load more...</Typography>
                        </Box>}
                <div>
                    {
                        state.list_comment.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Divider/>
                                    <div className={classes.wrapComment}>
                                        <img className={classes.image} src={item.user_avatar}/>
                                        <div className={classes.textComment}>
                                            <div className={classes.titleComment}>
                                                <Typography className={classes.name}>{item.user_name}</Typography>
                                                <Typography className={classes.date}>{item.date_comment}</Typography>
                                            </div>
                                            <Typography className={classes.body}>{item.body_html}</Typography>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Divider/>
                </div>
            </div>
        </div>
    );
};

export default CommentComponents;