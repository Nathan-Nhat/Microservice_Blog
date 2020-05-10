import * as Actions from '../../Actions/ActionConstant/ActionConstants'

const initialState = {
    isOpen: false,
    data: {
        message: '',
        type: 'success'
    }
};

const NotifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.OPEN_NOTIF:
            return {
                isOpen: true,
                data: {
                    message: action.data.message,
                    type: action.data.type,
                }
            };
        case Actions.CLOSE_NOTIF:
            return {
                ...state,
                isOpen: false,
            }
        default:
            return state;
    }
}

export default NotifyReducer;