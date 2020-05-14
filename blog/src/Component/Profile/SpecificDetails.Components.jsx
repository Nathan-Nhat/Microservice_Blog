import React from 'react';
import HeaderDetails from './HeaderDetails.Components'
import BodyDetailsComponents from "./BodyDetails.Components";
const SpecificDetailsComponents = ({user_id}) => {
    return (
        <div>
            <HeaderDetails user_id = {user_id}/>
            <BodyDetailsComponents user_id = {user_id}/>
        </div>
    );
};

export default SpecificDetailsComponents;