import React from 'react';
import TagComponent from "../Component/Tags/Tag.Component";
import {makeStyles, Typography, Divider, useMediaQuery, Input, InputAdornment, Box} from "@material-ui/core";
import {theme} from "../Themes";
import {useLocation, useHistory} from 'react-router-dom'
import queryString from 'query-string'
import {get_data} from "../ApiCall";
import {URL_POST_SERVICE} from "../Constants";
import {useSelector} from "react-redux";
import SubdirectoryArrowRightRoundedIcon from "@material-ui/icons/SubdirectoryArrowRightRounded";
import {HtmlTooltip} from "../Component/Appbar.Component";
import SearchIcon from "@material-ui/icons/Search";
import Pagination from "@material-ui/lab/Pagination";

const useStyle = makeStyles({
    title: {
        marginTop: '2rem',
        padding: '1rem'
    },
    main: {
        display: 'grid',
        gridTemplateColumns: props => props.isMobile ? 'auto' : 'auto auto auto',
        marginTop: props => props.isMobile ? '2rem' : '3rem',
    },
    tagContained: {
        padding: "1rem"
    },
    searchContainer: {
        marginTop: "1rem",
        padding: '1rem',
        width: '100%',
        boxSizing: 'border-box',
    },
    search: {
        float: 'right',
        border: '1px solid rgba(0,0,0,0.2)',
        padding: '0.2rem 0.6rem 0.2rem 0.6rem',
        borderRadius: '1rem',
        right: 0,
        width: props => props.isMobile ? '100%' : ''
    }
})
const AllTagPage = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const classes = useStyle({isMobile})
    const location = useLocation()
    const page = queryString.parse(location.search).page
    const queryTag = queryString.parse(location.search).q
    const history = useHistory()
    const [state, setState] = React.useState({
        isLoading: false,
        page: page ? page : 1,
        total_pages: 0,
        total_tags: 0,
        tags: []
    })
    const {isAuthenticated, id} = useSelector(state => state.AuthenReducer)
    React.useEffect(() => {
        setState({...state, isLoading: true})
        get_data(URL_POST_SERVICE + '/tags', {page: page, current_user_id: id, query_tag: queryTag}, false)
            .then(res => {
                setState({
                    ...state,
                    total_tags: res.data.total_tags,
                    isLoading: false,
                    total_pages: res.data.total_pages,
                    page: page,
                    tags: res.data.tags
                })
            })
    }, [page, queryTag])
    const [query, setQuery] = React.useState({
        queryWord: ''
    })
    const handleChange = (e) => {
        let val = e.target.value
        let name = e.target.name
        setQuery({
            ...query,
            [name]: val
        })
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            history.push(`/all_tags?q=${query.queryWord}&page=${1}`)
        }
    }
    const handlePageChange = (e, newVal)=>{
         history.push(`/all_tags?q=${query.queryWord}&page=${newVal}`)
    }
    return (
        <div style={{position: 'relative'}}>
            <Typography variant={'h4'}
                        className={classes.title}>Tags <span>{`(${state.total_tags})`}</span></Typography>
            <Divider variant={'middle'}/>
            <div className={classes.searchContainer}>
                <HtmlTooltip disableHoverListener arrow={true} placement="bottom-start"
                             title={
                                 <React.Fragment>
                                     <Typography style={{fontSize: '0.7rem'}}>{`Press `}
                                         <div style={{
                                             border: "1px solid #888a8c",
                                             padding: '0 0.5rem 0 0.5rem',
                                             borderRadius: '3px',
                                             display: 'inline-block'
                                         }}>
                                             <SubdirectoryArrowRightRoundedIcon
                                                 style={{fontSize: '0.7rem', paddingRight: '0.3rem'}}/>
                                             Enter
                                         </div>
                                         {` to search`}</Typography>
                                 </React.Fragment>
                             }
                >
                    <Input className={classes.search}
                           onKeyDown={handleKeyDown}
                           id="input-with-tags"
                           variant='outlined'
                           disableUnderline
                           onChange={handleChange}
                           name="queryWord" value={query.queryWord}
                           placeholder={'Enter keyword'}
                           startAdornment={(<InputAdornment>
                               <SearchIcon style={{marginRight: '0.4rem', opacity: '0.5'}}/>
                           </InputAdornment>)}
                    />
                </HtmlTooltip>
            </div>
            <div className={classes.main}>
                {
                    state.tags.map((item, index) => {
                        return (
                            <div className={classes.tagContained} key = {item.tag_id}>
                                <TagComponent tag={item}/>
                            </div>
                        )
                    })
                }
            </div>
            <Box>
                {
                    state.total_pages <= 1 ? null :
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <Pagination page={state.page} count={state.total_pages} variant="outlined"
                                        style={{marginTop: '1rem', alignSelf: 'center'}}
                                        color="primary" onChange={handlePageChange}/>
                        </div>
                }
            </Box>
        </div>
    );
};

export default AllTagPage;