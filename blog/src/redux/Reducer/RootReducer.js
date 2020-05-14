import {combineReducers} from 'redux'
import PostReducer from './ChildReducers/PostReducer'
import RequestPostReducer from "./ChildReducers/RequestPostReducer";
import NotifyReducer from "./ChildReducers/NotifyReducer";
import AuthenReducer from "./ChildReducers/AuthenReducer";
import togglePopUpReducer from './ChildReducers/togglePopUpReducer'
const RootReducer = (history) => combineReducers({
    PostReducer,
    RequestPostReducer,
    NotifyReducer,
    AuthenReducer,
    togglePopUpReducer,
});
export default RootReducer;