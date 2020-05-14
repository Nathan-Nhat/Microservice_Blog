import React, {useEffect, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import {withStyles} from "@material-ui/core/styles";
import {useHistory, useLocation} from 'react-router-dom'

const AntTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#1890ff',
    },
})(Tabs);

const AntTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
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
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    selected: {},
}))((props) => <Tab disableRipple {...props} />);

const check_location = (path) => {
    let arr = path.split('/')
    if (arr[3] === 'followers') return 1
    else if (arr[3] === 'following') return 2
    else return 0
}

const HeaderPost = ({user_id}) => {
    const location = useLocation()
    const [selected, setSelected] = useState(check_location(location.pathname))
    const history = useHistory()
    const handleChange = (event, newValue) => {
        setSelected(newValue)
        if (newValue === 0) {
            history.push(`/profile/${user_id}`)
        } else if (newValue === 1) {
            history.push(`/profile/${user_id}/followers`)
        } else {
            history.push(`/profile/${user_id}/following`)
        }
    }
    return (
        <div>
            <AntTabs value={selected} onChange={handleChange}>
                <AntTab label={'Posts'}></AntTab>
                <AntTab label={'Followers'}></AntTab>
                <AntTab label={'Following'}></AntTab>
            </AntTabs>
        </div>
    );
};

export default HeaderPost;