import React, {useEffect, useState} from 'react';
import {get_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import {Box, CircularProgress, Button} from "@material-ui/core";
import PostComponent from "../Post/Post.Component";
import Pagination from "@material-ui/lab/Pagination";

const PostUserComponent = ({user_id}) => {
    const [state, setState] = useState({
        isLoading: true,
        posts: [],
        user: {}
    })
    useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/${user_id}/posts`, {page: 0}, false)
            .then(res => {
                console.log(res)
                setState({
                    isLoading: false,
                    posts: res.data.posts,
                    user: res.data.user
                })
            })
    }, [user_id])
    const handleChange = (e, newVal) => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/${user_id}/posts`, {page: newVal}, false)
            .then(res => {
                console.log(res)
                setState({
                    isLoading: false,
                    posts: res.data.posts,
                    user: res.data.user
                })
            })
    }
    return (
        <div>
            {
                state.isLoading === true ?
                    null
                    :
                    <Box style={{textAlign: 'center', width: '90%', margin: "2rem auto"}}>
                        <Box>
                            {
                                state.posts.map((item, index) => {
                                    return <PostComponent post={item} user={state.user} key={index}/>
                                })
                            }
                        </Box>
                        <Box>
                            <Pagination page={state.page} count={state.total_pages} variant="outlined"
                                        style={{width: '350px', margin: " 2rem auto"}}
                                        color="primary" onChange={handleChange}/>
                        </Box>
                    </Box>

            }

        </div>
    );
};

export default PostUserComponent;