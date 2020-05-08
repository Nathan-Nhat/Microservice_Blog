import {combineReducers} from 'redux'
import PostReducer from './ChildReducers/PostReducer'
import RequestPostReducer from "./ChildReducers/RequestPostReducer";
const RootReducer = (history) => combineReducers({
    PostReducer,
    RequestPostReducer
});
export default RootReducer;