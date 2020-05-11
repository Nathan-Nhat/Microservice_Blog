import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Typography, Button} from "@material-ui/core";
import * as API from '../../ApiCall'
import {URL_PROFILE_SERVICE} from '../../Constants'
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import HomeIcon from '@material-ui/icons/Home';
import {useSelector} from "react-redux";

const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "row"
    },
    image: {
        width: "20rem",
        height: "20rem",
        borderRadius: "0.5rem"
    },
    boxDetails: {
        marginLeft: "2rem"
    },
    nameText: {
        fontWeight: "bold",
        // fontSize :"3rem"
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
        float: 'left'
    },
    field: {
        display: "flex",
        flexDirection: "row"
    },
    followText : {
        lineHeight :'3rem',
        marginLeft : '2rem'
    }
})
const DetailsComponent = ({user_id}) => {
    const classes = useStyle()
    const [profile, setProfile] = useState({
        firstName: 'Anonymous',
        fullName: 'Anonymous',
        email: 'anonymous@gmail.com',
        address: 'La khe - Ha Dong - Ha Noi',
        member_since: '06-01-1996',
        about_me: 'N/A',
        avatar_hash: 'https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg',
        number_follower: 0,
        number_followed: 0,
        is_followed: false,
    })
    const {id, isAuthenticated} = useSelector(state => state.AuthenReducer)
    useEffect(() => {
        API.get_data(URL_PROFILE_SERVICE + '/user_profile', {
            profile_id: user_id,
            my_user_id: localStorage.getItem('user_id')
        }, false)
            .then(res => setProfile({
                firstName: res.data.name.split(' ')[1],
                fullName: res.data.name,
                email: res.data.email,
                address: res.data.address,
                about_me: res.data.about_me,
                member_since: res.data.member_since,
                avatar_hash: res.data.avatar_hash,
                number_follower: res.data.number_follower,
                number_followed: res.data.number_followed,
                is_followed: res.data.is_followed
            }))
    }, [])

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
        <div className={classes.container}>
            <img className={classes.image} src={profile.avatar_hash}/>
            <Box className={classes.boxDetails}>
                <Typography variant='h3' align='left' className={classes.nameText}>{profile.firstName}</Typography>
                <div className={classes.field}>
                    <PersonRoundedIcon style={{marginRight: "1rem"}}/>
                    <Typography align='left'>{profile.fullName}</Typography>
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
                    parseInt(user_id) === id ? null :
                        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row'}}>
                            {profile.is_followed ?
                                <Button onClick={handleUnFollow} variant={'contained'}
                                        color='secondary'>Following</Button> :
                                <Button onClick={handleFollow} variant={'contained'} color='primary'>Follow</Button>
                            }
                            <Typography className={classes.followText}>Follower : {profile.number_follower}</Typography>
                            <Typography className={classes.followText}>Following : {profile.number_followed}</Typography>
                        </div>
                }

                {
                    parseInt(user_id) === id ?
                        <Button className={classes.button} variant='outlined'>Edit Profile</Button> : null
                }
            </Box>
        </div>
    );
};

export default DetailsComponent;