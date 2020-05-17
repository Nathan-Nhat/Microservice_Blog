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

const useStyle = makeStyles({
    rootContainer: {
        marginTop: '2rem'
    },
    container: {
        display: "flex",
        flexDirection: "row",
        padding: '2rem'
    },
    image: {
        width: "15rem",
        height: "15rem",
        borderRadius: "0.5rem",
        margin: 'auto'
    },
    boxDetails: {
        marginLeft: "2rem",
        display : 'flex',
        flexDirection : 'column'
    },
    nameText: {
        fontWeight: "bold",
        // fontSize :"3rem",
        marginBottom: '1rem'
    },
    element: {
        marginTop: "1rem",
    },
    author: {
        marginTop: "1rem",
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
        flexDirection: 'column'
    },
    followContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2rem'
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
        marginTop: '0.5rem',
        boxShadow: 'none'
    },
})
const DetailsComponent = ({user_id}) => {
    const classes = useStyle()
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
                    console.log(res)
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
            {profile.isLoading ? null :
                <div>
                    <div className={classes.container}>
                        <div className={classes.imageContainer}>
                            <img className={classes.image} src={profile.avatar_hash}/>
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
                        </div>
                        <Box className={classes.boxDetails}>
                            <div className={classes.titleContainer}>
                                <Typography variant='h4' align='left'
                                            className={classes.nameText}>{profile.fullName}</Typography>
                                {
                                    (!isAuthenticated || parseInt(user_id) === id) ? null :
                                        profile.is_followed ?
                                            <Button variant={'contained'} className={classes.followBtnProfile}
                                                    color={"primary"}
                                                    onClick={handleUnFollow}>Following</Button> :
                                            <Button variant={'outlined'} color='primary'
                                                    className={classes.followBtnProfile}
                                                    onClick={handleFollow}>Follow</Button>
                                }
                            </div>
                            <div className={classes.field}>
                                <EmailRoundedIcon style={{marginRight: "1rem"}}/>
                                <Typography align='left'>{profile.email}</Typography>
                            </div>
                            <div className={classes.field}>
                                <HomeIcon style={{marginRight: "1rem"}}/>
                                <Typography align='left'><a
                                    href={`https://www.google.com/maps/place/${profile.address}`}>{profile.address}</a></Typography>
                            </div>

                            <Typography className={classes.element} align='left'>{profile.about_me}</Typography>
                            <Typography className={classes.author} align='left'>Member
                                since {profile.member_since.substr(0, 10)}</Typography>
                            {
                                parseInt(user_id) === id ?
                                    <Button className={classes.button} variant='outlined'
                                            onClick={() => dispatch(open_profile_popup())}>Edit Profile</Button> : null
                            }
                            <Divider style={{marginTop :"1rem"}}/>
                            <FollowerComponents user_id={user_id}/>
                        </Box>
                        <FormDialog data={profile} profileChange={changeProfile}/>
                    </div>
                    <Divider style={{marginTop: "2rem"}}/>
                </div>
            }
        </div>
    );
};

export default DetailsComponent;