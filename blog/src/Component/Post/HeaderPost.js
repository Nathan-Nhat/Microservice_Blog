import React, {useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import {withStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useHistory} from 'react-router-dom'
import {theme} from "../../Themes";
const AntTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: theme.palette.primary.main
    },
})(Tabs);

const AntTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        paddingRight: theme.spacing(4),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: theme.palette.primary.light,
            opacity: 1,
        },
        '&$selected': {
            color: theme.palette.primary.dark,
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: theme.palette.primary.main,
        },
    },
    selected: {},
}))((props) => <Tab disableRipple {...props} />);
const HeaderPost = () => {
    const location = useLocation()
    const history = useHistory()
    const type = location.pathname === '/p/newest'? 0: location.pathname === '/p/saved'? 1 : 2
    const {isAuthenticated, id} = useSelector(state=>state.AuthenReducer)
    const handleChange= (e, newVal)=>{
        history.push(newVal === 0? '/p/newest' : newVal === 1? '/p/saved' : '/p/followed_tags')
    }
    return (
        <div style={{}}>
            <AntTabs value={type} onChange={handleChange}>
                <AntTab label={'New Posts'}></AntTab>
                {
                    isAuthenticated?
                    <AntTab label={'Saved Posts'}></AntTab> : null
                }
                {
                    isAuthenticated?
                    <AntTab label={'Followed Tags'}></AntTab> : null
                }
            </AntTabs>
        </div>
    );
};

export default HeaderPost;