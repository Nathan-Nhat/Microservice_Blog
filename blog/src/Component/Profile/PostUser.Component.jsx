import React, {useEffect, useState} from 'react';
import {get_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import {useParams} from 'react-router-dom'
import {Box, CircularProgress, Button} from "@material-ui/core";
import PostComponent from "../Post/Post.Component";

const PostUserComponent = () => {
    const [state, setState] = useState({
        isLoading: true,
        posts: [],
        user : {}
    })
    const {user_id} = useParams()
    useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/${user_id}/posts`, {}, false)
            .then(res => {
                console.log(res)
                setState({
                    isLoading: false,
                    posts: res.data.posts,
                    user : res.data.user
                })
            })
    }, [])
    return (
        <div>
            {
                state.isLoading === true ?
                    <div style={{height: '100vh'}}>
                        <CircularProgress style={{marginTop: '3rem'}}/>
                    </div>
                    :
                    <Box style={{textAlign: 'center'}}>
                        <Box>
                            {
                                state.posts.map((item, index) => {
                                    return <PostComponent post={item} user = {state.user} key={index}/>
                                })
                            }
                        </Box>
                    </Box>

            }

        </div>
    );
};

export default PostUserComponent;