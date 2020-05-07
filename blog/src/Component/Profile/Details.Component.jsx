import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Typography, Button} from "@material-ui/core";
import * as API from '../../ApiCall'
import {URL_PROFILE_SERVICE} from '../../Constants'
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import HomeIcon from '@material-ui/icons/Home';
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
        marginTop: "1rem"
    },
    button: {
        marginTop: "1rem",
        float: 'left'
    },
    field : {
        display : "flex",
        flexDirection : "row"
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
        about_me: 'N/A'
    })
    useEffect(() => {
        API.get_data(URL_PROFILE_SERVICE + '/user_profile?user_id=' + user_id)
            .then(res => setProfile({
                firstName: res.data.name.split(' ')[1],
                fullName: res.data.name,
                email: res.data.email,
                address: res.data.address,
                about_me: res.data.about_me,
                member_since: res.data.member_since
            }))
    }, [])

    return (
        <div className={classes.container}>
            <img className={classes.image} src="https://i.stack.imgur.com/l60Hf.png"/>
            <Box className={classes.boxDetails}>
                <Typography variant='h3' align='left' className={classes.nameText}>{profile.firstName}</Typography>
                <div className={classes.field}>
                    <PersonRoundedIcon  style = {{ marginRight : "1rem"}}/>
                    <Typography align='left'>{profile.fullName}</Typography>
                </div>
                 <div className={classes.field} >
                    <EmailRoundedIcon  style = {{ marginRight : "1rem"}}/>
                    <Typography align='left'>{profile.email}</Typography>
                </div>
                <div className={classes.field} >
                    <HomeIcon style = {{ marginRight : "1rem"}}/>
                    <Typography align='left'><a
                    href={`https://www.google.com/maps/place/${profile.address}`}>{profile.address}</a></Typography>
                </div>

                <Typography className={classes.element} align='left'>{profile.about_me}</Typography>
                <Typography className={classes.element} align='left'>Member
                    since {profile.member_since.substr(0, 10)}</Typography>
                {user_id === localStorage.getItem('user_id') ?
                    <Button className={classes.button} variant='outlined'>Edit Profile</Button> : null}
            </Box>
        </div>
    );
};

export default DetailsComponent;