import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ReactMarkdown from "react-markdown/with-html";
import CodeBlock from "../Helper/CodeBlock";
import './MarkdownPost.css'
import {Button, InputAdornment, useMediaQuery} from "@material-ui/core";
import {get_data, post_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {useDispatch, useSelector} from "react-redux";
import {open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
import {Redirect} from 'react-router-dom'
import {Input} from '@material-ui/core'
import SearchIcon from "@material-ui/icons/Search";
import {Typography} from "@material-ui/core";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import {theme} from "../Themes";

const useStyle = makeStyles({
    root_container: {
        float: 'left',
        width: "100%",
        padding: props => props.isMobile ? '1rem 0 1rem 0' : '4rem 0 2rem 0'
    },
    inputTitle: {
        fontSize: '2rem',
        border: 'none',
        padding:'0.5rem',
        width: "100%",
        fontWeight: 'bold',
        '&:focus': {
            outline: 'None'
        }
    },
    tags: {
        border: 'none',
        width: "100%",
        padding: '1rem 0',
        '&:focus': {
            outline: 'None'
        }
    },

    bodyContianer: {
        display: "flex",
        flexDirection: props => props.isMobile ? 'column' : 'row',
        padding: '2rem 0',
    },
    body_html: {
        fontSize: '1.2rem',
        width: props => props.isMobile ? '100%' : "50%",
        border: '1px solid #9494b8',
        boxSizing: 'border-box',
        '&:focus': {
            outline: 'None'
        },
        padding: '1rem',
        height: '80vh'
    },
    buttonSave: {
        float: "right"
    },
    hintElementFocus: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0.7rem',
        '&:hover': {
            backgroundColor: '#42a5f5',
            cursor: 'pointer'
        }
    }
})

var timeout = null
const WritePostComponent = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const [state, setState] = useState({
        title: '',
        tag: '',
        tags: [],
        body: '',
        isLoading: false,
        isFocusedTags: false
    })
    const [hint, setHint] = useState({
        tags: [],
        is_focusing: false
    })
    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setState({
                ...state,
                [name]: value
            }
        )
    }
    React.useEffect(() => {
        clearTimeout(timeout)
        if (state.tag === '') {
            setHint({...hint, tags: []})
        } else {
            timeout = setTimeout(() => {
                get_data(URL_POST_SERVICE + '/tags', {query_tag: state.tag}, false)
                    .then(res => setHint({
                        ...hint,
                        tags: res.data.tags
                    }))
            }, 2000)
        }
    }, [state.tag])
    const dispatch = useDispatch()
    const {isAuthenticated, id} = useSelector(state => state.AuthenReducer)
    const handleSave = () => {
        if (state.tags.length === 0) {
            dispatch(open_notification({message: 'You need to put at least 1 tags.', type: 'error'}))
            return;
        }
        setState({...state, isLoading: true})
        const data = {
            title: state.title,
            body: state.body,
            author_id: id,
            tags: state.tags.join(',')
        }
        if (data.title === '' | data.body === '') {
            dispatch(open_notification({message: "Write something", type: 'error'}))
            return
        }
        post_data(URL_POST_SERVICE + `/`, {}, data, true)
            .then(res => {
                setState({...state, isLoading: false})
                dispatch(open_notification({message: "Save post successful", type: 'success'}))
            })
            .catch(error => {
                dispatch(open_notification({message: "Save post fail. Try again", type: 'error'}))
            })
    }
    const handleFocus = () => {
        setState({...state, isFocusedTags: true})
    }
    const handleBlur = () => {
        if (hint.is_focusing)
            setState({...state, isFocusedTags: true})
        else
            setState({...state, isFocusedTags: false})

    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            let cur_tags = state.tags
            if (state.tag.length > 20) {
                dispatch(open_notification({message: 'Number character of tag must be smaller than 20', type :"error"}))
                return
            }
            if (!cur_tags.includes(state.tag)) {
                cur_tags.push(state.tag)
            }
            setState({...state, tag: '', tags: cur_tags, isFocusedTags: false})
        }
    }
    const handleDeleteTags = (index) => {
        let cur_tags = state.tags
        cur_tags.splice(index, 1)
        setState({
            ...state,
            tags: cur_tags
        })
    }

    const handleClickHint = (name) => {
        let cur_tags = state.tags
        if (!cur_tags.includes(name)) {
            cur_tags.push(name)
        }
        setState({...state, tag: '', tags: cur_tags, isFocusedTags: false})
    }
    React.useEffect(() => {
        return () => {
            clearTimeout(timeout)
        }
    }, [])
    return (
        <div className={classes.root_container}>
            {
                !isAuthenticated ? <Redirect to={'/'}/> :
                    <div style={isMobile ? {padding: '1rem'} : {padding: '0 2rem 2rem 2rem'}}>
                            <Input className={classes.inputTitle} placeholder={`Title`} name='title' value={state.title}
                                   onChange={handleChange}></Input>
                        <div style={{position: 'relative'}}>
                            <Input name='tag' className={classes.tags} placeholder={`Input Tags`} value={state.tag}
                                   disableUnderline
                                   onChange={handleChange}
                                   onFocus={handleFocus} onBlur={handleBlur}
                                   onKeyDown={handleKeyDown}
                                   startAdornment={(<InputAdornment>
                                       <SearchIcon
                                           style={{
                                               paddingLeft: '0.5rem',
                                               paddingRight: '0.5rem',
                                               color: 'black',
                                               opacity: '0.7'
                                           }}/>
                                   </InputAdornment>)}/>
                            {
                                state.isFocusedTags ?
                                    <div style={{
                                        width: '100%',
                                        zIndex: 999,
                                        position: 'absolute',
                                        backgroundColor: '#dedede',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        {
                                            hint.tags.map((tag, index) => {
                                                return (
                                                    <div key={index}
                                                         onMouseEnter={() => {
                                                             setHint({...hint, is_focusing: true})
                                                         }}
                                                         onMouseLeave={() => {
                                                             setHint({...hint, is_focusing: false})
                                                         }}
                                                         onClick={() => handleClickHint(tag.tag_name)}
                                                    >
                                                        <div
                                                            className={classes.hintElementFocus}>
                                                            <img alt={''}
                                                                 style={{
                                                                     width: '2rem',
                                                                     height: '2rem',
                                                                     borderRadius: '50%'
                                                                 }}
                                                                 src={tag.url_image}/>
                                                            <Typography
                                                                style={{
                                                                    lineHeight: '2rem',
                                                                    paddingLeft: '1rem'
                                                                }}>{tag.tag_name}</Typography>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> : <div></div>
                            }
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                {
                                    state.tags.map((item, index) => {
                                        return <div key={index} style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: 'rgba(211,47,47,0.2)',
                                            border: '1px solid red',
                                            padding: '0.3rem',
                                            borderRadius: '0.3rem',
                                            marginRight: '0.3rem'
                                        }}>
                                            <Typography style={{
                                                fontSize: '0.8rem',
                                                lineHeight: '1rem',
                                                color: 'red'
                                            }}>{item}</Typography>
                                            <CloseRoundedIcon
                                                style={{
                                                    fontSize: '0.8rem',
                                                    paddingLeft: '0.3rem',
                                                    color: 'red'
                                                }}
                                                onClick={() => handleDeleteTags(index)}/>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={classes.bodyContianer}>
                                            <textarea name='body' className={classes.body_html} placeholder={`Body`}
                                                      value={state.body}
                                                      onChange={handleChange}></textarea>

                            {
                                isMobile?  null:
                                <ReactMarkdown className="markdown_write" source={state.body}
                                            escapeHtml={false} renderers={{code: CodeBlock}}/>
                            }
                        </div>
                        <Button variant={'contained'} color={'primary'} className={classes.buttonSave}
                                onClick={handleSave} C>Save</Button>
                    </div>
            }
        </div>
    );
};

export default WritePostComponent;

