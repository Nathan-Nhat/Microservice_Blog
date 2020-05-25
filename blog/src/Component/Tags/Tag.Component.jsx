import React from 'react';
import {makeStyles, Typography, Button} from "@material-ui/core/";
import DefautlAvatar from '../../image/background.jpg'
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from "@material-ui/icons/Check";
import {NavLink} from "react-router-dom";
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../../Themes";
import {delete_data, post_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom'
const useStyle = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent : props=>props.isMobile?'flex-start' : 'center'
    },
    image: {
        height: '7rem',
        width: '7rem',
        borderRadius: '0.5rem'
    },
    detail: {
        paddingLeft: "0.8rem"
    },
    titleTag: {

    }
})
const TagComponent = ({tag}) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const [state, setState] = React.useState(
        {
            is_followed : tag.is_followed,
            num_following : tag.num_following,
        })
    const {isAuthenticated, id} = useSelector(state=>state.AuthenReducer)
    const history = useHistory()
    const handleFollow = () =>{
         if (!isAuthenticated) {
            history.push({pathname: '/login', state: {nextUrl: `/all_tags`}})
        }
         else if (!state.is_followed) {
             post_data(URL_POST_SERVICE + `/tags/${tag.tag_id}/follow`, {}, {}, true)
                 .then(res => setState({
                     ...state,
                     is_followed: true,
                     num_following: state.num_following + 1
                 }))
         } else {
             delete_data(URL_POST_SERVICE + `/tags/${tag.tag_id}/follow`, {}, true)
                .then(res => setState({
                     ...state,
                     is_followed: false,
                     num_following: state.num_following - 1
                 }))
         }
    }
    return (
        <div className={classes.root}>
            <img src={tag.tag_image} className={classes.image}/>
            <div className={classes.detail}>
                <NavLink to= {`/tag/${tag.tag_id}`} >
                    <Typography variant={'h6'} className={classes.titleTag}>{tag.tag_name}</Typography>
                </NavLink>
                <Typography style={{opacity: '50%', fontSize: '0.9rem'}}><span
                    style={{fontWeight: 'bold'}}>{state.num_following}</span> Followers</Typography>
                <Typography style={{opacity: '50%', fontSize: '0.9rem'}}><span
                    style={{fontWeight: 'bold'}}>{tag.num_posts}</span> posts</Typography>
                <Button variant={!state.is_followed?'outlined' : 'contained'} color={'primary'}
                        style={{padding: '0.1rem 1rem 0.1rem 1rem', marginTop: '0.7rem', boxShadow : 'none'}} onClick={handleFollow}>
                    {
                        !state.is_followed ?
                            <AddIcon style={{fontSize: '1.1rem'}}/> :
                            <CheckIcon style={{marginRight: '0.3rem', fontSize: "1.2rem"}}/>
                    }
                    {
                        !state.is_followed?
                        'Follow' : 'Followed'
                    }
                </Button>
            </div>
        </div>
    );
};

export default TagComponent;