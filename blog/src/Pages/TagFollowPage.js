import React from 'react';
import {Typography, Button, Divider, Box, useMediaQuery} from "@material-ui/core";
import {delete_data, get_data, post_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {useParams} from 'react-router-dom'
import PostComponent from "../Component/Post/Post.Component";
import Pagination from "@material-ui/lab/Pagination";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {useHistory, useLocation} from 'react-router-dom'
import {theme} from "../Themes";
import queryString from 'query-string'
import {Dialog, DialogTitle, TextField} from '@material-ui/core'

const useStyle = makeStyles({
    root: {
        padding: "3rem 1rem 1rem 1rem"

    },
    tagsContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: '2rem'
    },
    tagImage: {
        marginRight: props => props.isMobile ? '1rem' : '3rem',
        width: '4rem',
        height: '4rem',
        borderRadius: '50%'
    },
    tagNameContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    tagName: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginRight: '1rem',
        gridColumnStart: 1,
        gridColumnEnd: 4
    },
    follow: {
        display: 'flex',
        flexDirection: 'row',
    },
    followerText: {
        fontSize: '0.9rem',
        lineHeight: '1.9rem'
    },
    dialogTag: {
        padding: '1rem',
        display: "flex",
        flexDirection: 'column'
    },
})
const TagFollowPage = () => {
    const {tag_id} = useParams()
    const history = useHistory()
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    const location = useLocation()
    const page = queryString.parse(location.search).page
    const [state, setState] = React.useState({
        isLoading: false,
        tag_id: tag_id,
        tag_name: '',
        url_image: '',
        posts: [],
        total_pages: 0,
        page: page ? page : 1,
        itemPerPage: 0,
        is_followed: false,
        num_follower: 0,
        total: 0
    })
    const handleChange = (e, newVal) => {
        history.push(`/tag/${tag_id}?page=${newVal}`)
    }
    React.useEffect(() => {
        let param = {page: page ? page : 1}
        if (isAuthenticated) param = {current_user_id: id, page: page ? page : 1}
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + `/tags/${tag_id}/post`, param, false)
            .then(res => {
                setState({
                    ...state,
                    isLoading: false,
                    tag_id: res.data.tag_id,
                    tag_name: res.data.tag_name,
                    url_image: res.data.url_image,
                    posts: res.data.Post,
                    total_pages: res.data.total_pages,
                    page: res.data.page,
                    itemPerPage: res.data.itemPerPage,
                    is_followed: res.data.is_followed,
                    num_follower: res.data.num_follower,
                    total: res.data.total
                })
            })
    }, [tag_id, page])
    const handleFollow = () => {
        if (!isAuthenticated) {
            history.push({pathname: '/login', state: {nextUrl: `/tag/${tag_id}`}})
        }
        post_data(URL_POST_SERVICE + `/tags/${tag_id}/follow`, {}, {}, true)
            .then(res => setState({...state, is_followed: true, num_follower: state.num_follower + 1}))
    }
    const handleUnFollow = () => {
        delete_data(URL_POST_SERVICE + `/tags/${tag_id}/follow`, {}, true)
            .then(res => setState({...state, is_followed: false, num_follower: state.num_follower - 1}))
    }
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const handleImageChange = (e) => {
        let val = e.target.files[0]
        console.log(val)
        let url = URL.createObjectURL(val)
        setState({...state, url_image: url})
    }
    return (
        <div>
            {state.isLoading ? <div></div> :
                <div className={classes.root}>
                    <Box className={classes.follow}>
                        <div className={classes.tagsContainer}>
                            <img className={classes.tagImage} src={state.url_image} alt={''}/>
                            <div style={{display: 'inline-grid', gridTemplateColumns: "auto auto auto"}}>
                                <Typography className={classes.tagName}>{state.tag_name}</Typography>
                                <Typography className={classes.followerText}><a
                                    style={{color: 'green'}}>{state.total} </a>Posts</Typography>
                                <Divider orientation={'vertical'} flexItem={true} style={{margin: '0.3rem'}}/>
                                <Typography className={classes.followerText}><a
                                    style={{color: 'green'}}>{state.num_follower} </a>Followers</Typography>
                            </div>
                        </div>
                        <div style={{flexGrow: 1}}></div>
                        <input name='image_tag' type='file' onChange={handleImageChange}/>
                        <Box>
                            {!state.is_followed ?
                                <Button onClick={handleFollow} variant={'outlined'} color='primary'>Follow</Button> :
                                <Button onClick={handleUnFollow} variant={'contained'} color={"primary"}
                                        style={{boxShadow: 'none'}}>Unfollow</Button>
                            }
                        </Box>
                    </Box>
                    <Divider/>
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
                                        <Pagination page={state.page} count={state.total_pages} variant="outlined"
                                                    style={{marginTop: '1rem', alignSelf: 'center'}}
                                                    color="primary" onChange={handleChange}/>
                                    </div>
                            }
                        </Box>
                    </Box>
                </div>
            }
        </div>
    );
};

export default TagFollowPage;