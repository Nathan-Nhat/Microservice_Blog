import React, {useState} from 'react';
import {IconButton, Typography} from "@material-ui/core";
import {NavLink, useHistory} from "react-router-dom";
import moment from "moment";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import {makeStyles} from "@material-ui/core/styles";
import {delete_data, post_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import {Divider, Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
const useStyle = makeStyles({
    wrapComment: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0.5rem 0 0.5rem 0'
    },
    image: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
    },
    textComment: {
        backgroundColor: "rgba(168, 168, 168, 0.2)",
        marginLeft: '1rem',
        wordBreak: 'break-all',
        padding: '1rem',
        borderRadius: '1rem',
        position: 'relative'
    },
    titleComment: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconLikeContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        right: 0,
        borderRadius: '1rem',
        padding: '0.05rem 0.2rem 0.05rem 0.2rem',
        marginRight: '0.5rem',
    },
    iconLike: {
        backgroundColor: "rgba(0, 55, 255,0.9)",
        borderRadius: '50%',
        color: 'white',
        padding: "0.2rem", fontSize: '0.6rem',
        marginTop: '0.1rem'
    },
    numLike: {
        fontSize: '1rem',
        lineHeight: '1.2rem',
        marginLeft: '0.5rem'
    },
    date: {
        fontSize: '0.8rem',
        color: 'gray'
    },
    name: {
        color: 'blue',
        // fontWeight: 'bold',
    },
    navLink: {
        textDecoration: 'none'
    },
    likeText: {
        color: props => props.item.is_liked ? 'rgba(0, 55, 255,0.9)' : 'gray',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    iconDelete :{
        alignSelf :'center',
    }
})

const SingleCommentComponents = ({item, post_id, changeLike}) => {
    const classes = useStyle({item})
    const {isAuthenticated, id} = useSelector(state => state.AuthenReducer)
    const history = useHistory()
    const toggleLike = (e, comment_id) => {
        if (!isAuthenticated) {
            history.push({pathname: '/login', state: {nextUrl: `/post/${post_id}`}})
            return
        }
        if (!item.is_liked) {
            post_data(URL_POST_SERVICE + `/comments/${comment_id}/like`, {}, {}, true)
                .then(res => {
                    let is_liked = true
                    let number_like = item.number_like + 1
                    changeLike(item.comment_id, number_like, is_liked)
                })
        } else {
            delete_data(URL_POST_SERVICE + `/comments/${comment_id}/like`, {}, true)
                .then(res => {
                    let is_liked = false
                    let number_like = item.number_like - 1
                    changeLike(item.comment_id, number_like, is_liked)
                })
        }
    }

    const [isDeleted, setDelete] = React.useState(false)
    const handleDelete = (e, comment_id)=>{
        delete_data(URL_POST_SERVICE+`/comments/${comment_id}`,{}, true )
            .then(res=>{
                setDelete(true)
            })
    }
    return (
        <div>
            {
                isDeleted ? null :
                    <div className={classes.wrapComment}>
                        <img className={classes.image} src={item.user_comment.avatar_hash} alt={''}/>
                        <div>
                            <div style={{display:'flex',flexDirection : 'row'}}>
                                <div className={classes.textComment}>
                                    <Typography className={classes.name}><NavLink
                                        className={classes.navLink}
                                        to={`/profile/${item.user_comment.user_id}`}>{item.user_comment.name}</NavLink></Typography>
                                    <Typography className={classes.body}>{item.body_html}</Typography>
                                    {
                                        item.number_like <= 0 ? null :
                                            <Paper className={classes.iconLikeContainer}>
                                                <ThumbUpAltIcon className={classes.iconLike}/>
                                                <Typography className={classes.numLike}>{item.number_like}</Typography>
                                            </Paper>
                                    }
                                </div>
                                {
                                    isAuthenticated && id === item.user_comment.user_id?
                                    <IconButton className={classes.iconDelete} size={'small'} onClick={(e) => {
                                        handleDelete(e, item.comment_id)
                                    }}>
                                        <DeleteForeverIcon/>
                                    </IconButton> : null
                                }
                            </div>
                            <div style={{marginTop: '0.2rem'}}>
                                <div style={{
                                    display: 'flex', flexDirection: 'row', marginLeft: '1.5rem'
                                }}>
                                    <Typography className={classes.likeText}
                                                onClick={(e) => toggleLike(e, item.comment_id)}>
                                        {item.is_liked ? 'Liked' : 'Like'}</Typography>
                                    <Divider orientation={'vertical'} flexItem={true} style={{
                                        margin: '0.3rem',
                                    }}/>
                                    <Typography
                                        className={classes.date}>{moment(item.date_comment).fromNow()}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}


export default SingleCommentComponents;