import React from 'react';
import DetailsComponent from "../Component/Profile/Details.Component";
import {Divider} from "@material-ui/core";
import {useParams} from 'react-router-dom'
const ProfilePage = () => {
    const {userId} = useParams()
    console.log(userId)
    return (
        <div>
            <DetailsComponent user_id={userId} ></DetailsComponent>
            <Divider style = {{marginTop : "2rem"}}/>
        </div>
    );
};

export default ProfilePage;