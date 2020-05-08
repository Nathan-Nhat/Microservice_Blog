import {createStore, compose, applyMiddleware} from 'redux';
import RootReducers from '../Reducer/RootReducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../RootSaga/RootSaga'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory();
const composeEnhancers = !process.env.NODE_ENV !== 'production' &&
    typeof(window) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload : false
    }) : compose;
const sagaMiddleware = createSagaMiddleware();
const routerMiddle = routerMiddleware(history);
const storeConfig = ()=>{
    const middleWares = [sagaMiddleware, routerMiddle];
    const enhancers = [applyMiddleware(...middleWares)];
    const store = createStore(RootReducers(history), composeEnhancers(...enhancers));
    sagaMiddleware.run(rootSaga);
    return store;
}


export default storeConfig;