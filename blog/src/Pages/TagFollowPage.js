import React from 'react';
import {Typography, Button, Divider, Box} from "@material-ui/core";
import {delete_data, get_data, post_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {useParams} from 'react-router-dom'
import PostComponent from "../Component/Post/Post.Component";
import Pagination from "@material-ui/lab/Pagination";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom'
const useStyle = makeStyles({
    root: {
        margin: '3rem 0',

    },
    tagsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom : '2rem'
    },
    tagImage: {
        fontSize: '4rem',
        color: 'red',
        marginRight : '3rem',
        width: '4rem',
        height :'4rem',
        borderRadius : '50%'
    },
    tagNameContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    tagName: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        gridColumnStart : 1,
        gridColumnEnd: 4
    },
    follow: {
        display : 'flex',
        flexDirection : 'row',
    },
    followerText : {
        fontSize : '0.9rem',
        lineHeight :'1.9rem'
    }
})
const TagFollowPage = () => {
    const {tag_id} = useParams()
    const history = useHistory()
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    const [state, setState] = React.useState({
        tag_id: tag_id,
        tag_name: '',
        url_image : '',
        posts: [],
        total: 0,
        page: 0,
        itemPerPage: 0,
        is_followed: false,
        num_follower : 0
    })
    const handleChange = (e, newVal) => {
        get_data(URL_POST_SERVICE + `/tags/${tag_id}/post`, {page: newVal}, false)
            .then(res => {
                console.log(res)
                setState({
                    ...state,
                    tag_id: res.data.tag_id,
                    tag_name: res.data.tag_name,
                    url_image : res.data.url_image,
                    posts: res.data.Post,
                    total: res.data.total_pages,
                    page: res.data.page,
                    itemPerPage: res.data.itemPerPage,
                    num_follower : res.data.num_follower
                })
            })
    }
    React.useEffect(() => {
        let param = {}
        if (isAuthenticated) param = {current_user_id : id}
        get_data(URL_POST_SERVICE + `/tags/${tag_id}/post`, param, false)
            .then(res => {
                console.log(res)
                setState({
                    tag_id: res.data.tag_id,
                    tag_name: res.data.tag_name,
                    url_image : res.data.url_image,
                    posts: res.data.Post,
                    total: res.data.total_pages,
                    page: res.data.page,
                    itemPerPage: res.data.itemPerPage,
                    is_followed : res.data.is_followed,
                    num_follower : res.data.num_follower
                })
            })
    }, [tag_id])
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
    const classes = useStyle()
    return (
        <div className={classes.root}>
            <Box className={classes.follow}>
                <div className={classes.tagsContainer}>
                    <img className={classes.tagImage} src={state.url_image}/>
                    <div style={{display:'inline-grid', gridTemplateColumns : "auto auto auto"}}>
                        <Typography className={classes.tagName}>{state.tag_name}</Typography>
                        <Typography className={classes.followerText}><a style={{color : 'green'}}>{state.total} </a>Posts</Typography>
                        <Divider orientation={'vertical'} flexItem={true} style={{margin: '0.3rem'}}/>
                         <Typography className={classes.followerText}><a style={{color : 'green'}}>{state.num_follower} </a>Followers</Typography>
                    </div>
                </div>
                <div style={{flexGrow: 1}}></div>
                <Box>
                    {!state.is_followed?
                        <Button onClick={handleFollow} variant={'outlined'} color = 'primary'>Follow</Button> :
                        <Button onClick={handleUnFollow} variant={'contained'} color={"primary"} style={{boxShadow: 'none'}}>Unfollow</Button>
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
                    <Pagination page={state.page} count={state.total_pages} variant="outlined"
                                style={{width: '350px', margin: " 2rem auto"}}
                                color="primary" onChange={handleChange}/>
                </Box>
            </Box>
        </div>
    );
};

export default TagFollowPage;