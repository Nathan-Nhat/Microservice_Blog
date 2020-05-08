import React, {useState, useEffect} from 'react';
import PostComponent from './Post.Component'
import HeaderPost from "./HeaderPost";
import {get_data} from '../../ApiCall'
import {URL_POST_SERVICE} from "../../Constants";
import {CircularProgress, Box} from '@material-ui/core';
import {useSelector, useDispatch} from "react-redux";
import Pagination from '@material-ui/lab/Pagination';
import {change_page_post} from "../../redux/Actions/ActionObjects/ActionsObjects";

const AllPostComponents = () => {
    const request_post = useSelector(state => state.RequestPostReducer)
    const [state, setState] = useState({
        isLoading: true,
        posts: [{
            title: "Title",
            body: 'Summary',
            author_id: 123,
            date_post: '06/01/1996'
        }],
        page: 0,
        total_pages: 1,
    })
    const dispatch = useDispatch()
    useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/get_all?type=${request_post.type}&page=${request_post.page}`, false)
            .then(res => {
                setState({
                    isLoading: false,
                    posts: res.data.Post,
                    page: res.data.page,
                    total_pages: res.data.total_pages
                })
                console.log(res)
            })
    }, [request_post])
    const handleChange = (e, newVal) => {
        dispatch(change_page_post(newVal))
    }
    return (
        <div>
            <HeaderPost/>
            {
                state.isLoading === true ?
                    <CircularProgress style={{marginTop: "3rem"}}/>
                    :
                    <Box>
                        <Box>
                            {
                                state.posts.map((item, index) => {
                                    return <PostComponent data={item} key={index}/>
                                })
                            }
                        </Box>
                        <Box>
                            <Pagination page={state.page} count={state.total_pages} variant="outlined"
                                        color="primary" onChange={handleChange}/>
                        </Box>
                    </Box>
            }

        </div>
    );
};

export default AllPostComponents;