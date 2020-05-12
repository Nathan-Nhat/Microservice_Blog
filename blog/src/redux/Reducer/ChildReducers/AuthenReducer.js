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
                isAuthenticated: action.data.isAuthenticated,
                id : action.data.id,
                name : action.data.name,
                email: action.data.email
            }
            console.log(state)
            return state;
        default:
            return state;
    }
}

export default AuthenReducer;