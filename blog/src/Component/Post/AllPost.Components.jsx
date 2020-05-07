import React, {useState, useEffect} from 'react';
import PostComponent from './Post.Component'
import HeaderPost from "./HeaderPost";
import {get_data} from '../../ApiCall'
import {URL_POST_SERVICE} from "../../Constants";
import {CircularProgress, Box} from '@material-ui/core';

const AllPostComponents = () => {
    const [state, setState] = useState({
        isLoading: true,
        posts: [{
            title: "Title",
            body: 'Summary',
            author_id: 123,
            date_post: '06/01/1996'
        }]
    })
    useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + '/get_all', false)
            .then(res => setState({
                isLoading: false,
                posts: res.data.Post
            }))
    }, [])
    return (
        <div>
            <HeaderPost/>
            {
                state.isLoading === true ?
                    <CircularProgress style={{marginTop:"3rem"}}/>
                    :
                    <Box> {
                        state.posts.map((item, index) => {
                            return <PostComponent data={item}/>
                        })
                    }</Box>
            }
        </div>
    );
};

export default AllPostComponents;