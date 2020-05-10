import * as Actions from '../../Actions/ActionConstant/ActionConstants'

const initialState = {
    isAuthenticated: false,
    id: 0,
    name: '',
    email: ''
};

const AuthenReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.FETCH_USER:
            state = {
                isAuthenticated: true,
                id : action.data.user_id,
                name : action.data.user_name,
                email: action.data.user_email
            }
            return state;
        default:
            return state;
    }
}

export default AuthenReducer;