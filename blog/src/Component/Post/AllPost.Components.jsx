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
import queryString from "query-string";
import {useLocation, useHistory} from 'react-router-dom'

const useStyle = makeStyles({
    root: {
        textAlign: 'center',
    }
})
const AllPostComponents = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const classes = useStyle({isMobile})
    const location = useLocation()
    const page = queryString.parse(location.search).page
    const pathname = location.pathname
    const [state, setState] = useState({
        isLoading: true,
        posts: [],
        total_pages: 1,
        page: page
    })
    const history = useHistory()
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    useEffect(() => {
        setState({...state, isLoading: true})
        let params = isAuthenticated ? {
            type: pathname === '/p/newest' ? 0 : pathname === '/p/saved' ? 1 : 2,
            page: page ? page : 1,
            user_current_id: id
        } : {type: pathname === '/p/newest' ? 0 : pathname === '/p/saved' ? 1 : 2, page: page ? page : 1}
        get_data(URL_POST_SERVICE + `/get_all`, params, false)
            .then(res => {
                setState({
                    isLoading: false,
                    posts: res.data.Post,
                    page: res.data.page,
                    total_pages: res.data.total_pages
                })
            })
    }, [page, pathname])
    const handleChange = (e, newVal) => {
        history.push(`${pathname}?page=${newVal}`)
    }
    return (
        <div className={classes.root}>
            {
                state.isLoading === true ?
                    null
                    :
                    <div>
                        {
                            pathname === '/p/followed_tags' ?
                                <div style = {{marginTop : '4rem', fontSize  :'2rem'}}>
                                    Inprogress...
                                </div> :
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
                                                <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <Pagination page={state.page} count={state.total_pages}
                                                                variant="outlined"
                                                                style={{marginTop: '1rem', alignSelf: 'center'}}
                                                                color="primary" onChange={handleChange}/>
                                                </div>
                                        }
                                    </Box>
                                </Box>
                        }
                    </div>
            }

        </div>
    );
};

export default AllPostComponents;