import axios from 'axios'

export function get_data(url, param, is_jwt_required) {
    var jwt = null
    var user_id = null
    var params = param
    if (is_jwt_required) {
        jwt = localStorage.getItem('jwt')
        user_id = localStorage.getItem('user_id')
        if (jwt !== null && user_id !== null)
            params = Object.assign({}, param,{token : jwt}, {user_id:user_id});

    }
    return axios({
        method: 'GET',
        url: url,
        params: params,
    })
}

export function post_data(url, param, data, is_jwt_required) {
    var jwt = null
    var user_id = null
    var params = param
    if (is_jwt_required) {
        jwt = localStorage.getItem('jwt')
        user_id = localStorage.getItem('user_id')
        if (jwt !== null && user_id !== null)
            params = Object.assign({}, param,{token : jwt}, {user_id:user_id});
    }
    return axios({
        method: 'POST',
        url: url,
        params: params,
        data: data,
    })
}

export function delete_data(url, param, is_jwt_required) {
    var jwt = null
    var user_id = null
    var params = param
    if (is_jwt_required) {
        jwt = localStorage.getItem('jwt')
        user_id = localStorage.getItem('user_id')
        if (jwt !== null && user_id !== null)
            params = Object.assign({}, param,{token : jwt}, {user_id:user_id});
    }
    return axios({
        method: 'DELETE',
        url: url,
        params: params,
    })
}
