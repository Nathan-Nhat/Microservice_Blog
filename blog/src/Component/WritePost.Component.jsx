import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ReactMarkdown from "react-markdown/with-html";
import CodeBlock from "../Helper/CodeBlock";
import '../Markdown.style.css'
import {Button} from "@material-ui/core";
import {post_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {useDispatch} from "react-redux";
import {open_notification} from "../redux/Actions/ActionObjects/ActionsObjects";

const useStyle = makeStyles({
    root_container: {
        float: 'left',
        width: "100%",
        margin: '4rem 0 2rem 0'
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
        margin: '1rem 0',
        '&:focus': {
            outline: 'None'
        }
    },

    bodyContianer: {
        display: "flex",
        flexDirection: 'row',
        margin: '2rem 0',
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
    markdown: {
        border: '1px solid #9494b8',
        borderLeft: '0px',
        width: '50%',
        padding: '1rem',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        height: '40rem',
        boxSizing: 'content-box',
        overflow: 'auto',
    },
    button_save: {
        float: "right"
    }
})
const initState = {
    title: '',
    tag: '',
    body: '',
    isLoading: false
}
const WritePostComponent = () => {
    const classes = useStyle()
    const [state, setState] = useState(initState)
    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setState({
            ...state,
            [name]: value
        })
    }
    const dispatch = useDispatch()
    const handleSave = () => {
        setState({...state, isLoading: true})
        const data = {
            title: state.title,
            body: state.body,
            author_id: localStorage.getItem('user_id')
        }
        if (data.title === '' | data.body === ''){
            dispatch(open_notification({message: "Write something", type: 'error'}))
            return
        }
        post_data(URL_POST_SERVICE + `/`, {},data, true)
            .then(res => {
                console.log(res)
                setState({...state, isLoading: false})
                dispatch(open_notification({message: "Save post successful", type: 'success'}))
            })
            .catch(error => {
                console.log(error)
                dispatch(open_notification({message: "Save post fail. Try again", type: 'error'}))
            })
    }
    return (
        <div className={classes.root_container}>
            <div style={{padding: '0 2rem 2rem 2rem'}}>
                <input className={classes.inputTitle} placeholder={`Title`} name='title' value={state.title}
                       onChange={handleChange}></input>
                <input name='tag' className={classes.tags} placeholder={`Input Tags`} value={state.tag}
                       onChange={handleChange}/>
                <div className={classes.bodyContianer}>
                    <textarea name='body' className={classes.body_html} placeholder={`Body`} value={state.body}
                              onChange={handleChange}/>
                    <ReactMarkdown className={classes.markdown} source={state.body}
                                   escapeHtml={false} renderers={{code: CodeBlock}}/>
                </div>
                <Button variant={'contained'} color={'primary'} className={classes.button_save}
                        onClick={handleSave} C>Save</Button>
            </div>
        </div>
    );
};

export default WritePostComponent;

