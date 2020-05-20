import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Typography, Button, Divider} from "@material-ui/core";
import * as API from '../../ApiCall'
import {URL_PROFILE_SERVICE} from '../../Constants'
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import HomeIcon from '@material-ui/icons/Home';
import {useSelector, useDispatch} from "react-redux";
import {open_profile_popup} from "../../redux/Actions/ActionObjects/ActionsObjects";
import FormDialog from "./EditDialog.Component";
import FollowerComponents from "./Follower.Components";
import {useMediaQuery} from "@material-ui/core";
import {theme} from "../../Themes";

const useStyle = makeStyles({
    rootContainer: {
        paddingTop: '2rem'
    },
    container: {
        display: "flex",
        flexDirection: "column",
        padding: props => props.isMobile ? '1rem' : '2rem'
    },
    image: {
        width: "4.5rem",
        height: "4.5rem",
        borderRadius: "0.5rem",
        margin: '0 1rem'
    },
    boxDetails: {
        paddingLeft: "2rem",
        display: 'flex',
        flexDirection: 'column'
    },
    nameText: {
        fontWeight: "bold",
        fontSize: "1rem",
    },
    element: {
        paddingTop: "1rem",
    },
    author: {
        paddingTop: "1rem",
        fontStyle: 'italic',
        fontSize: '0.8rem'
    },
    button: {
        marginTop: "1rem",
        float: 'left',
    },
    field: {
        display: "flex",
        flexDirection: "row"
    },
    followText: {
        display: 'flex',
        flexDirection: 'column',
        width: '33%',
        textAlign: 'center',
    },
    imageContainer: {
        display: 'flex',
        flexDirection: props => props.isMobile ? 'column' : 'row',
        // alignSelf: 'flex-start'
    },
    followContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row`'
    },
    followBtnProfile: {
        fontSize: "0.8rem",
        lineHeight: '0.8rem',
        display: 'inline-block',
        marginLeft: '1rem',
        alignSelf: 'flex-start',
        boxShadow: 'none'
    },
    left: {
        width: props => props.isMobile ? '100%' : '50%'
    },
    right: {
        marginTop : props => props.isMobile? '1rem' : '0',
        width: props => props.isMobile ? '100%' : '50%'
    }
})
const DetailsComponent = ({user_id}) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const dispatch = useDispatch()
    const [profile, setProfile] = useState({
        isLoading: true,
        fullName: 'Anonymous',
        email: 'anonymous@gmail.com',
        address: 'La khe - Ha Dong - Ha Noi',
        member_since: '06-01-1996',
        about_me: 'N/A',
        avatar_hash: 'https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg',
        number_follower: 0,
        number_followed: 0,
        is_followed: false,
        number_posts: 0
    })
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    useEffect(() => {
        var params = isAuthenticated ? {profile_id: user_id, my_user_id: id} : {profile_id: user_id}
        setProfile({...profile, isLoading: true})
        API.get_data(URL_PROFILE_SERVICE + '/user_profile', params, false)
            .then(res => {
                    setProfile({
                        user_id: user_id,
                        isLoading: false,
                        fullName: res.data.name,
                        email: res.data.email,
                        address: res.data.address,
                        about_me: res.data.about_me,
                        member_since: res.data.member_since,
                        avatar_hash: res.data.avatar_hash,
                        number_follower: res.data.number_follower,
                        number_followed: res.data.number_followed,
                        is_followed: res.data.is_followed,
                        number_posts: res.data.total_posts
                    })
                }
            )
            .catch(error => setProfile({...profile, isLoading: false}))
    }, [user_id])

    const changeProfile = (data) => {
        setProfile({
            ...profile,
            address: data.address,
            about_me: data.about_me,
            fullName: data.fullName,
        })
    }
    const handleFollow = () => {
        API.post_data(URL_PROFILE_SERVICE + '/follow', {user_follow: user_id}, null, true)
            .then(res => setProfile({
                ...profile,
                number_follower: profile.number_follower + 1,
                is_followed: true
            }))
    }

    const handleUnFollow = () => {
        API.delete_data(URL_PROFILE_SERVICE + '/follow', {user_follow: user_id}, true)
            .then(res => setProfile({
                ...profile,
                number_follower: profile.number_follower - 1,
                is_followed: false
            }))
    }

    return (
        <div className={classes.rootContainer}>
            {profile.isLoading ? <div></div> :
                <div>
                    <div className={classes.container}>
                        <div className={classes.imageContainer}>
                            <div className={classes.left}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                    <img className={classes.image} src={profile.avatar_hash} alt={''}/>
                                    <div>
                                        <div className={classes.titleContainer}>
                                            <Typography align='left'
                                                        className={classes.nameText}>{profile.fullName}</Typography>
                                            {
                                                (!isAuthenticated || parseInt(user_id) === id) ? <div></div> :
                                                    profile.is_followed ?
                                                        <Button variant={'contained'}
                                                                className={classes.followBtnProfile}
                                                                color={"primary"}
                                                                onClick={handleUnFollow}>Following</Button> :
                                                        <Button variant={'outlined'} color='primary'
                                                                className={classes.followBtnProfile}
                                                                onClick={handleFollow}>Follow</Button>
                                            }
                                        </div>
                                        <div className={classes.field}>
                                            <EmailRoundedIcon style={{paddingRight: "1rem"}}/>
                                            <Typography align='left'>{profile.email}</Typography>
                                        </div>
                                        <div className={classes.field}>
                                            <HomeIcon style={{paddingRight: "1rem"}}/>
                                            <Typography align='left'><a
                                                href={`https://www.google.com/maps/place/${profile.address}`}>{profile.address}</a></Typography>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Typography className={classes.element}
                                                align='left'>{profile.about_me}</Typography>
                                    <Typography className={classes.author} align='left'>Member
                                        since {profile.member_since.substr(0, 10)}</Typography>
                                    {
                                        parseInt(user_id) === id ?
                                            <Button className={classes.button} variant='outlined'
                                                    onClick={() => dispatch(open_profile_popup())}>Edit
                                                Profile</Button> :
                                            <div></div>
                                    }
                                </div>
                            </div>
                            <div className={classes.right}>
                                <div className={classes.followContainer}>
                                    <div className={classes.followText}>
                                        <Typography style={{fontSize: '0.7rem'}}>FOLLOWERS</Typography>
                                        <Typography style={{
                                            fontSize: '1.5rem',
                                            color: "green"
                                        }}>{profile.number_follower}</Typography>
                                    </div>
                                    <Divider orientation={'vertical'} flexItem/>
                                    <div className={classes.followText}>
                                        <Typography style={{fontSize: '0.7rem'}}>FOLLOWING</Typography>
                                        <Typography style={{
                                            fontSize: '1.5rem',
                                            color: 'red'
                                        }}>{profile.number_followed}</Typography>
                                    </div>
                                    <Divider orientation={'vertical'} flexItem/>
                                    <div className={classes.followText}>
                                        <Typography style={{fontSize: '0.7rem'}}>POSTS</Typography>
                                        <Typography style={{fontSize: '1.5rem'}}>{profile.number_posts}</Typography>
                                    </div>
                                </div>
                                <FollowerComponents user_id={user_id}/>
                            </div>
                        </div>
                        <Divider style={{marginTop: "1rem"}}/>
                        <FormDialog data={profile} profileChange={changeProfile}/>
                    </div>
                </div>
            }
        </div>
    );
};

export default DetailsComponent;