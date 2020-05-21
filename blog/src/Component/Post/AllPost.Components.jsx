import React, {useState, useEffect} from 'react';
import PostComponent from './Post.Component'
import HeaderPost from "./HeaderPost";
import {get_data} from '../../ApiCall'
import {URL_POST_SERVICE} from "../../Constants";
import {CircularProgress, Box} from '@material-ui/core';
import {useSelector, useDispatch} from "react-redux";
import Pagination from '@material-ui/lab/Pagination';
import {change_page_post} from "../../redux/Actions/ActionObjects/ActionsObjects";
import {Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../../Themes";

const useStyle = makeStyles({
    root: {
        textAlign: 'center',
        padding: props => props.isMobile ? "2rem 1rem 1rem 1rem" : '4rem 2rem 2rem 2rem'
    }
})
const AllPostComponents = () => {
    const request_post = useSelector(state => state.RequestPostReducer)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const classes = useStyle({isMobile})
    const [state, setState] = useState({
        isLoading: true,
        posts: [{
            author: null
        }],
        page: 0,
        total_pages: 0,
    })
    const dispatch = useDispatch()
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    useEffect(() => {
        setState({...state, isLoading: true})
        let params = isAuthenticated ? {
            type: request_post.type,
            page: request_post.page,
            user_current_id: id
        } : {type: request_post.type, page: request_post.page}
        get_data(URL_POST_SERVICE + `/get_all`, params, false)
            .then(res => {
                setState({
                    isLoading: false,
                    posts: res.data.Post,
                    page: res.data.page,
                    total_pages: res.data.total_pages
                })
            })
    }, [request_post])
    const handleChange = (e, newVal) => {
        dispatch(change_page_post(newVal))
    }
    return (
        <div className={classes.root}>
            <HeaderPost/>
            {
                state.isLoading === true ?
                    <div style={{height: '100vh'}}>
                        <CircularProgress style={{padding: '3rem'}}/>
                    </div>
                    :
                    <Box style={{textAlign: 'center'}}>
                        <Box>
                            {
                                state.posts.map((item, index) => {
                                    return <div key={index}>
                                        <PostComponent post={item} user={item.author}/>
                                        <Divider/>
                                    </div>
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

export default AllPostComponents;