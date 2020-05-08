import * as Actions from '../../Actions/ActionConstant/ActionConstants'
const initialState = {

};

const PostReducer = (state = initialState, action)=>{
    switch(action.type) {
        case Actions.FETCH_POST_SUCCESS:
            break;
        default:
            return state;
    }
}

export default PostReducer;