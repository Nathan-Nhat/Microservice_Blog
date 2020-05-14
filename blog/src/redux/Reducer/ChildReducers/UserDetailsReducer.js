import * as Actions from '../../Actions/ActionConstant/ActionConstants'
const initialState = {
    posts : []
};

const UserDetailsReducer = (state = initialState, action)=>{
    switch(action.type) {
        case Actions.FETCH_USER_DETAILS_SUCCESS:
            return {
                posts: action.data.posts
            };
        default:
            return state;
    }
}

export default UserDetailsReducer;