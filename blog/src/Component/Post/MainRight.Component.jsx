import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import PostPopularComponent from "../Summary/PostPopular.Component";
import UserPopularComponent from "../Summary/UserPopular.Component";

const useStyle = makeStyles({
    root: {
        width: '400px',
        height: '400px',
        padding: '1rem',
        marginRight: '2rem',
        alignSelf: "flex-start",
        position: 'sticky',
        top: 0
    }
})
const MainRightComponent = () => {
    const classes = useStyle()
    return (
        <div className={classes.root}>
            <PostPopularComponent/>
            <UserPopularComponent/>
        </div>
    );
};

export default MainRightComponent;