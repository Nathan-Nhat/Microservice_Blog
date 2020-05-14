import React from 'react';
import DetailsComponent from "../Component/Profile/Details.Component";
import {Divider} from "@material-ui/core";
import {useParams} from 'react-router-dom'
import SpecificDetailsComponents from "../Component/Profile/SpecificDetails.Components";

const ProfilePage = () => {
    const {userId} = useParams()
    console.log(userId)
    return (
        <div>
            <DetailsComponent user_id={userId} ></DetailsComponent>
            <SpecificDetailsComponents/>
        </div>
    );
};

export default ProfilePage;