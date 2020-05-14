import {fork, take, call, takeEvery, put, takeLatest} from 'redux-saga/effects'
import * as Actions from '../Actions/ActionConstant/ActionConstants'
import {get_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";
import {fetch_user_details_success, open_notification} from "../Actions/ActionObjects/ActionsObjects";

/*=============Authentication Saga================*/
function* fetchUserDetails(action){
    // user login
    console.log("user login");
    try {
        if (action.data.type == 0) {
            const res = yield call(get_data, URL_POST_SERVICE + `/${action.data.user_id}/posts`, {},false)
            yield put(fetch_user_details_success(res.data))
        }
    } catch (e) {
        yield put(open_notification({message : 'Error when fetch user post', type: 'error'}))
    }
}

function* watchFetchUserDetails() {
    yield takeEvery(Actions.FETCH_USER_DETAILS, fetchUserDetails)
}
/*==============Root Saga================*/
function* rootSaga(){
    console.log('This is root saga');
    yield fork(watchFetchUserDetails)
}

export default rootSaga;

/*=====================Local function=================================*/
function* handleErrorCode(action){

}