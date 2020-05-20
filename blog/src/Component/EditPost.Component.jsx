import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ReactMarkdown from "react-markdown/with-html";
import CodeBlock from "../Helper/CodeBlock";
import './MarkdownPost.css'
import {Button} from "@material-ui/core";
import {get_data, put_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {useDispatch, useSelector} from "react-redux";
import {open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";
import {Redirect} from 'react-router-dom'
import {Input} from '@material-ui/core'
import SearchIcon from "@material-ui/icons/Search";
import {Typography, Divider, InputAdornment} from "@material-ui/core";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import {useParams} from 'react-router-dom'
const useStyle = makeStyles({
    root_container: {
        float: 'left',
        width: "100%",
        padding: '4rem 0 2rem 0'
    },
    inputTitle: {
        fontSize: '2rem',
        border: 'None',
        width: "100%",
        fontWeight: 'bold',
        '&:focus': {
            outline: 'None'
        }
    },
    tags: {
        border: 'None',
        width: "100%",
        padding: '1rem 0',
        '&:focus': {
            outline: 'None'
        }
    },

    bodyContianer: {
        display: "flex",
        flexDirection: 'row',
        padding: '2rem 0',
    },
    body_html: {
        fontSize: '1rem',
        width: "50%",
        border: '1px solid #9494b8',
        boxSizing: 'border-box',
        '&:focus': {
            outline: 'None'
        },
        padding: '1rem',
        height: '42rem + 2px'
    },
    button_save: {
        float: "right"
    },
    hintElementFocus: {
        display: 'flex',
        flexDirection: 'row',
        padding: '0.7rem',
        '&:hover': {
            backgroundColor: '#42a5f5',
            cursor : 'pointer'
        }
    }
})
var timeout = null
const EditPostComponent = () => {
    const classes = useStyle()
    const [state, setState] = useState({
        title: '',
        tag: '',
        tags: [],
        body: '',
        isLoading: false,
        isFocusedTags: false,
    })
    const [hint, setHint] = useState({
        tags : [],
        is_focusing : false
    })
    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setState({
            ...state,
            [name]: value
        })
    }
    useEffect(() => {
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
    const {isAuthenticated} = useSelector(state => state.AuthenReducer)
    const {post_id} = useParams()
    const handleSave = () => {
        setState({...state, isLoading: true})
        const data = {
            post_id: post_id,
            title: state.title,
            body: state.body,
            author_id: localStorage.getItem('user_id'),
	        tags: state.tags.join(',')
        }
        if (data.title === '' | data.body === '') {
            dispatch(open_notification({message: "Write something", type: 'error'}))
            return
        }
        put_data(URL_POST_SERVICE + `/`, {}, data, true)
            .then(res => {
                setState({...state, isLoading: false})
                dispatch(open_notification({message: "Save post successful", type: 'success'}))
            })
            .catch(error => {
                dispatch(open_notification({message: "Save post fail. Try again", type: 'error'}))
            })
    }

    React.useEffect(() => {
        get_data(URL_POST_SERVICE + `/${post_id}`, {}, false)
            .then(res => {
                let tags = res.data.tags.map((item)=> item.tag_name)
                setState({
                    tags : tags,
                    title: res.data.title,
                    body: res.data.body_html,
                    author_id: res.data.author.user_id,
                })
            })
        return () => {
            clearTimeout(timeout)
        }
    }, [])
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

    const handleClickHint = (name)=>{
        let cur_tags = state.tags
            if (!cur_tags.includes(name)) {
                cur_tags.push(name)
            }
            setState({...state, tag: '', tags: cur_tags, isFocusedTags: false})
    }
    return (
        <div className={classes.root_container}>
            {
                !isAuthenticated ? <Redirect to={'/'}/> :
                    <div style={{padding: '0 2rem 2rem 2rem'}}>
                        <input className={classes.inputTitle} placeholder={`Title`} name='title' value={state.title}
                               onChange={handleChange}></input>
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
                                               opacity: '70%'
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
                                                         onMouseLeave={()=>{
                                                             setHint({...hint, is_focusing: false})
                                                         }}
                                                         onClick={()=>handleClickHint(tag.tag_name)}
                                                    >
                                                        <Divider/>
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
                                        <Divider/>
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
                                            paddingLeft: '0.3rem'
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
                            <ReactMarkdown className="markdown_write" source={state.body}
                                           escapeHtml={false} renderers={{code: CodeBlock}}/>
                        </div>
                        <Button variant={'contained'} color={'primary'} className={classes.button_save}
                                onClick={handleSave} C>Save</Button>
                    </div>
            }
        </div>
    );
};

export default EditPostComponent;

