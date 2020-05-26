import React from 'react';
import {Button, Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import CheckIcon from '@material-ui/icons/Check';

const useStyle = makeStyles({
    tableContent: {
        minWidth: '250px',
        maxWidth: '250px',
        alignSelf: 'flex-start',
        padding: '2rem 2rem',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        float: 'right',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    },
    header1: {
        fontSize: "0.9rem",
        paddingTop: '0.5rem',
        '&:hover': {
            cursor: 'pointer',
            color: 'blue'
        },
    },
    header2: {
        fontSize: "0.9rem",
        padding: '0.2rem',
        lineHeight: '1.2rem',
        '&:hover': {
            cursor: 'pointer',
            color: 'blue'
        },
        paddingLeft: '1rem'
    },
    bodyContent: {
        padding: "0.6rem 1rem",
        height: '100%',
        overflow: 'auto'
    },
    likeCmt: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0rem 1rem 1rem 1rem',
        justifyContent: 'center',
    }
})
const PostRightComponent = ({parentData, post_id, toggle_like}) => {
    const classes = useStyle()
    return (
        <div className={classes.tableContent}>
            <div className={classes.likeCmt}>
                <div style={{width: '45%', textAlign: 'center'}}>
                    <Typography variant={"h4"}>{parentData.data.num_like}</Typography>
                    <Typography style={{fontSize: '0.8rem'}}>Saved</Typography>
                </div>
                <Divider orientation={"vertical"} flexItem={true}></Divider>
                <div style={{width: '45%', textAlign: 'center'}}>
                    <Typography variant={"h4"}>{parentData.data.num_comment}</Typography>
                    <Typography style={{fontSize: '0.8rem'}}>Comments</Typography>
                </div>
            </div>
            <Button variant={parentData.data.is_liked ? 'outlined' : 'contained'}
                    style={{borderRadius: '2rem'}}
                    color={'primary'} onClick={toggle_like}>
                {
                    parentData.data.is_liked ?
                        <CheckIcon style={{marginRight: '0.3rem', fontSize: "1.2rem"}}/> :
                        <BookmarkIcon style={{marginRight: '0.3rem', fontSize: "1.2rem"}}/>
                }
                {
                    parentData.data.is_liked?
                    'Saved' : 'Save'
                }
            </Button>
            <Divider style={{marginTop: '1rem'}}></Divider>
            <Typography style={{padding: '1rem 0 0', fontWeight: 'bold'}}>Table of contents</Typography>
            <div className={classes.bodyContent}>
                {
                    parentData.list_contents.map((item, index) => {
                            let ret = item.tagName === 'H1' ? <Typography key={index} onClick={() => {
                                    item.scrollIntoView({behavior: 'smooth', block: 'start'})
                                }} className={classes.header1}> {item.textContent}</Typography> :
                                <Typography key={index} onClick={() => {
                                    item.scrollIntoView({behavior: 'smooth', block: 'start'})
                                }} className={classes.header2}> {item.textContent}</Typography>
                            return ret
                        }
                    )
                }
            </div>

        </div>
    );
};

export default PostRightComponent;