import {combineReducers} from 'redux'
import UserDetailsReducer from './ChildReducers/UserDetailsReducer'
import RequestPostReducer from "./ChildReducers/RequestPostReducer";
import NotifyReducer from "./ChildReducers/NotifyReducer";
import AuthenReducer from "./ChildReducers/AuthenReducer";
import togglePopUpReducer from './ChildReducers/togglePopUpReducer'
const RootReducer = (history) => combineReducers({
    UserDetailsReducer,
    RequestPostReducer,
    NotifyReducer,
    AuthenReducer,
    togglePopUpReducer,
});
export default RootReducer;