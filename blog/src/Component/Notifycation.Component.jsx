import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import {useSelector, useDispatch} from "react-redux";
import {close_notification} from "../redux/Actions/ActionObjects/ActionsObjects";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// const useStyles = makeStyles((theme) => ({
//     root: {},
// }));

export default function CustomizedSnackbars({message, type}) {
    // const classes = useStyles();
    const data = useSelector(state => state.NotifyReducer)
    const dispatch = useDispatch()
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(close_notification())
    };
    return (
        <Snackbar open={data.isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{vertical: 'top',
        horizontal : 'right'}}
 >
            <Alert onClose={handleClose} severity={data.data.type}>
                {data.data.message}
            </Alert>
        </Snackbar>
    );
}