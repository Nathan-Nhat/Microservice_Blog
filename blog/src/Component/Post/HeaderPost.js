import React, {useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import {withStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {change_type_post} from "../../redux/Actions/ActionObjects/ActionsObjects";

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
const HeaderPost = () => {
    const [selected, setSelected] = useState(0)
    const dispatch = useDispatch()
    const handleChange = (event, newValue) => {
        setSelected(newValue)
        dispatch(change_type_post(newValue))
    }
    return (
        <div>
            <AntTabs value={selected} onChange={handleChange}>
                <AntTab label={'New Posts'}></AntTab>
                {/*<AntTab label={''}></AntTab>*/}
            </AntTabs>
        </div>
    );
};

export default HeaderPost;