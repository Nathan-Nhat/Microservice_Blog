import * as ActionTypes from '../../Actions/ActionConstant/ActionConstants'
const init_state = {
    profile_popup : false,
}

const togglePopUpReducer = (state = init_state, action) =>{
    switch (action.type) {
        case ActionTypes.OPEN_PROFILE_POPUP :
            return {
                ...state,
                profile_popup: true
            }
        case ActionTypes.CLOSE_PROFILE_POPUP:
            return {
                ...state,
                profile_popup: false
            }
        default:
            return state
    }
}

export default togglePopUpReducer;