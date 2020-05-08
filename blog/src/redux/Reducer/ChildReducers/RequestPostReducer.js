import * as Actions from '../../Actions/ActionConstant/ActionConstants'
const initialState = {
    page: 0,
    item_per_page : 20,
    type : 0,
};

const RequestPostReducer = (state = initialState, action)=>{
    switch(action.type) {
        case Actions.CHANGE_TYPE_POST:
            state = {...state, type : action.data}
            return state;
        case Actions.CHANGE_PAGE_POST:
            state = {...state, page : action.data}
            return state;
        default:
            return state;
    }
}

export default RequestPostReducer;