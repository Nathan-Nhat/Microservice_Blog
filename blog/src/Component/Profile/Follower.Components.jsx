import React from 'react';
import {get_data} from "../../ApiCall";
import {URL_PROFILE_SERVICE} from "../../Constants";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {useHistory} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyle = makeStyles({
    followerAvatar: {
        width: '1.8rem',
        height: '1.8rem',
        borderRadius: '50%',
        '&:hover': {
            cursor: "pointer",
        }
    },
    imageContainer: {
        marginTop: '0.5rem',
        display: 'inline-grid',
        gridTemplateColumns: 'auto auto auto auto auto auto auto auto auto auto',
        gridColumnGap: '0.7rem',
        gridRowGap: '0.8rem'
    },
    moreButton : {
        opacity :"70%",
        fontSize : '1rem',
        margin : 'auto',
         '&:hover': {
            cursor: "pointer",
             opacity :"100%",
        }
    }
})
const FollowerComponents = ({user_id}) => {
    const classes = useStyle()
    const [state, setState] = React.useState({followers: [], number_follower: 0, user_name: '', isLoading: true})
    const history = useHistory()
    React.useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_PROFILE_SERVICE + `/${user_id}/followers`, {}, true)
            .then(res => {
                setState({
                    isLoading: false,
                    followers: res.data.followers,
                    // followers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(() => res.data.followers[0]),
                    number_follower: res.data.total_followers,
                    // number_follower: 300,
                    user_name: res.data.user_name
                })
            })
    }, [user_id])
    return (
        <div style={{marginTop: '1rem'}}>
            {state.isLoading ? <div></div> :
                <div>
                    <Typography
                        style={{marginBottom: "0.2rem", opacity : '70%'}}>{`${state.number_follower} people following ${state.user_name}`}</Typography>
                    <div className={classes.imageContainer}>
                        {
                            state.followers.map((item, index) => {
                                return <Tooltip title={`${item.user_name}`} interactive key={index} >
                                    <img alt = {''} className={classes.followerAvatar} src={item.user_avatar}
                                         onClick={() => {
                                             history.push(`/profile/${item.user_id}`)
                                         }}/>
                                </Tooltip>
                            })
                        }
                        {
                            state.number_follower - 19 < 0? <div></div>:
                            <Tooltip title={`${state.number_follower - 19} other peoples`} interactive>
                                <MoreHorizIcon className={classes.moreButton}/>
                            </Tooltip>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default FollowerComponents;