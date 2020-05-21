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
        user: {},
        page: 0,
        itemPerPage:0,
        total_pages:0
    })
    useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/${user_id}/posts`, {page: 0}, false)
            .then(res => {
                console.log(res)
                setState({
                    isLoading: false,
                    posts: res.data.posts,
                    user: res.data.user,
                    page : res.data.page,
                    itemPerPage: res.data.itemPerPage,
                    total_pages: res.data.total_pages
                })
            })
    }, [user_id])
    const handleChange = (e, newVal) => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/${user_id}/posts`, {page: newVal}, false)
            .then(res => {
                setState({
                    isLoading: false,
                    posts: res.data.posts,
                    user: res.data.user,

                })
            })
    }
    return (
        <div>
            {
                state.isLoading === true ?
                    null
                    :
                    <Box style={{textAlign: 'center',  padding: "0 1rem 1rem"}}>
                        <Box>
                            {
                                state.posts.map((item, index) => {
                                    return <PostComponent post={item} user={state.user} key={index}/>
                                })
                            }
                        </Box>
                         <Box>
                            {
                                state.total_pages <= 1 ? null :
                                    <div style={{display: 'flex' , flexDirection : 'column' , width:'100%'}}>
                                    <Pagination page={state.page} count={state.total_pages} variant="outlined"
                                                style={{marginTop:'1rem', alignSelf:'center'}}
                                                color="primary" onChange={handleChange}/>
                                                </div>
                            }
                        </Box>
                    </Box>

            }

        </div>
    );
};

export default PostUserComponent;