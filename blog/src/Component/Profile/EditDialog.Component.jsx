import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useSelector, useDispatch} from "react-redux";
import {close_profile_popup, open_notification} from "../../redux/Actions/ActionObjects/ActionsObjects";
import {makeStyles} from "@material-ui/core/styles";
import {Divider} from "@material-ui/core";
import * as API from '../../ApiCall'
import * as URL from '../../Constants'
import {theme} from "../../Themes";
import {useMediaQuery} from "@material-ui/core";

const useStyle = makeStyles({
    contents: {
        display: 'flex',
        flexDirection: props => props.isMobile?'column':'row'
    },
    image: {
        minWidth: "10rem",
        maxWidth: '10rem',
        height: "10rem",
        borderRadius: "0.5rem",
        margin:'auto'
    },
    main: {
        '&>*': {
            paddingBottom: '1rem'
        }
    }
})
export default function FormDialog({data, profileChange}) {
    const open = useSelector(state => state.togglePopUpReducer.profile_popup)
    const dispatch = useDispatch()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [state, setState] = React.useState({
        fullName: data.fullName,
        email: data.email ,
        about_me: data.about_me ,
        address: data.address ,
        avatar_hash: data.avatar_hash
    })
    const handleClose = () => {
        dispatch(close_profile_popup())
    };
    const handleSave = () => {
        let body = {
            user_id: data.user_id,
            address: state.address,
            about_me: state.about_me,
            name: state.fullName
        }
        API.put_data(URL.URL_PROFILE_SERVICE + '/user_profile', {}, body, true)
            .then(res => {
                profileChange(state)
                dispatch(close_profile_popup())
            })
            .catch(err => dispatch(open_notification({message: 'Fail to change user', type: 'error'})))
    }
    const handleChange = (e) => {
        let name = e.target.name
        let value = e.target.value
        setState({
            ...state,
            [name]: value
        })
    }
    const classes = useStyle({isMobile})
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Profile</DialogTitle>
                <DialogContent className={classes.contents}>
                    <img className={classes.image} src={state.avatar_hash} alt={''}/>
                    <Divider orientation={isMobile?"horizontal" : 'vertical'} flexItem={true} style={{margin: '0 1rem 0 1rem'}}></Divider>
                    <div className={classes.main}>
                        <TextField
                            margin="dense"
                            label="Full name"
                            type="text"
                            value={state.fullName}
                            name='fullName'
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Email Address"
                            type="email"
                            value={state.email}
                            fullWidth
                            disabled={true}
                        />
                        <TextField
                            margin="dense"
                            label="Address"
                            type="text"
                            value={state.address}
                            fullWidth
                            name='address'
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="About me"
                            value={state.about_me}
                            type="text"
                            fullWidth
                            rows="4"
                            name='about_me'
                            onChange={handleChange}
                            multiline={true}
                        />
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
