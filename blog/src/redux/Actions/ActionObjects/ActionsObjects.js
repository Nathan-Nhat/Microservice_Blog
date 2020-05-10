import * as Actions from '../ActionConstant/ActionConstants'


export const change_type_post = (data) => ({
    type: Actions.CHANGE_TYPE_POST,
    data: data
})

export const change_page_post = (data) => ({
    type: Actions.CHANGE_PAGE_POST,
    data: data
})

export const fetch_user = (data) => ({
    type: Actions.FETCH_USER,
    data: data
})
export const open_notification = (data)=>({
    type : Actions.OPEN_NOTIF,
    data : data
})
export const close_notification = ()=>({
    type : Actions.CLOSE_NOTIF
})