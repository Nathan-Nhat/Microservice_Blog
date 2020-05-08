import {fork, take, call, takeEvery, put, takeLatest} from 'redux-saga/effects'
import * as Actions from '../Actions/ActionConstant/ActionConstants'
import {get_data} from "../../ApiCall";
import {URL_POST_SERVICE} from "../../Constants";

/*=============Authentication Saga================*/
function* fetchPost(action){
    // user login
    console.log("user login");
    try {
        const res = call(get_data, URL_POST_SERVICE + `/get_all?page=${action.data.page}&items_per_page=${action.data.item_per_page}`, false)
        console.log(res)
    } catch (e) {
        console.log(e)
    }
}

function* watchFetchPost(){
    yield takeEvery(Actions.FETCH_POST, fetchPost);
}


/*==============Root Saga================*/
function* rootSaga(){
    console.log('This is root saga');
    yield fork(watchFetchPost);
}

export default rootSaga;

/*=====================Local function=================================*/
function* handleErrorCode(action){

}