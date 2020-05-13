import React from 'react';
import {Button, Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {URL_POST_SERVICE, URL_PROFILE_SERVICE} from "../../Constants";
import {useHistory} from 'react-router-dom'
import * as API from "../../ApiCall";

const useStyle = makeStyles({
    tableContent: {
        minWidth : '300px',
        maxWidth :'300px',
        alignSelf: 'flex-start',
        padding: '2rem 2rem',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        float: 'right',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        opacity :"80%"
    },
    header1: {
        fontSize :"0.9rem",
        marginTop: '1rem',
        '&:hover': {
            cursor: 'pointer',
            color: 'blue'
        },
    },
    header2: {
        fontSize :"0.9rem",
        padding : '0.2rem',
        lineHeight : '1.2rem',
        '&:hover': {
            cursor: 'pointer',
            color: 'blue'
        },
        paddingLeft: '1rem'
    },
    bodyContent: {
        padding: "0.6rem 1rem"
    },
    likeCmt: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0rem 1rem 1rem 1rem',
        justifyContent: 'center',
    }
})
const PostRightComponent = ({parentData, post_id}) => {
    const classes = useStyle()
    const [state, setState] = React.useState({
        isLiked : parentData.data.is_liked,
        num_comment : parentData.data.num_comment,
        num_Like: parentData.data.num_like
    })
    const {id, isAuthenticated} = useSelector(state=>state.AuthenReducer)
    const history = useHistory()
    const handleLike = () => {
        let cur_like = state.num_Like + 1
        if (!isAuthenticated) {
            history.push({pathname: '/login', state: {nextUrl: `/post/${post_id}`}})
        }
        else
        {
            API.post_data(URL_POST_SERVICE + `/${post_id}/like`, {}, null, true)
                .then(res => setState({...state, isLiked: true, num_Like: cur_like}))
        }
    }

    const handleUnLike = () => {
            let cur_like = state.num_Like - 1
            API.delete_data(URL_POST_SERVICE + `/${post_id}/like`, {}, true)
                .then(res => setState({...state, isLiked: false, num_Like: cur_like}))
    }
    return (
        <div className={classes.tableContent}>
            <div className={classes.likeCmt}>
                <div style={{width: '45%', textAlign: 'center'}}>
                    <Typography variant={"h4"}>{state.num_Like}</Typography>
                    <Typography style={{fontSize : '0.8rem'}}>Likes</Typography>
                </div>
                <Divider orientation={"vertical"} flexItem={true}></Divider>
                <div style={{width: '45%', textAlign: 'center'}}>
                    <Typography variant={"h4"}>{state.num_comment}</Typography>
                    <Typography style={{fontSize : '0.8rem'}}>Comments</Typography>
                </div>
            </div>
            {state.isLiked ?
                <Button variant='outlined'
                        style={{borderRadius: '2rem'}}
                        color={'primary'} onClick={handleUnLike}>
                    Liked
                </Button> : <Button variant='contained'
                                    style={{borderRadius: '2rem'}}
                                    color={'primary'} onClick={handleLike}>Like</Button>
            }
            <Divider style={{marginTop: '1rem'}}></Divider>
            <Typography style={{margin: '1rem 0 0', fontWeight: 'bold'}}>Table of contents</Typography>
            <div className={classes.bodyContent}>
                {
                    parentData.list_contents.map((item, index) => {
                            let ret = item.tagName === 'H1' ? <Typography key={index} onClick={() => {
                                    item.scrollIntoView({behavior: 'smooth', block: 'start'})
                                }} className={classes.header1}> {item.textContent}</Typography> :
                                <Typography key={index} onClick={() => {
                                    item.scrollIntoView({behavior: 'smooth', block: 'start'})
                                }} className={classes.header2}> {item.textContent}</Typography>
                            return ret
                        }
                    )
                }
            </div>

        </div>
    );
};

export default PostRightComponent;