import {combineReducers} from 'redux'
import UserDetailsReducer from './ChildReducers/UserDetailsReducer'
import NotifyReducer from "./ChildReducers/NotifyReducer";
import AuthenReducer from "./ChildReducers/AuthenReducer";
import togglePopUpReducer from './ChildReducers/togglePopUpReducer'
const RootReducer = (history) => combineReducers({
    UserDetailsReducer,
    NotifyReducer,
    AuthenReducer,
    togglePopUpReducer,
});
export default RootReducer;