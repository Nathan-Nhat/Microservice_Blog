import React from 'react';
import PostUserComponent from "./PostUser.Component";
const SpecificDetailsComponents = ({user_id}) => {
    return (
        <div>
            <PostUserComponent user_id = {user_id}/>
        </div>
    );
};

export default SpecificDetailsComponents;