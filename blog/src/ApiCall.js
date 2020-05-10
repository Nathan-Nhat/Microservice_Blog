import axios from 'axios'

export function get_data(url, is_jwt_required) {
    var jwt = null
    var user_id = null
    if (is_jwt_required){
        jwt = localStorage.getItem('jwt')
        user_id = localStorage.getItem('user_id')
        url = url + '?token=' + jwt + '&user_id=' + user_id
    }
    return axios.get(url)
}

export function post_data(url, data, is_jwt_required) {
    var jwt = null
    var user_id = null
    if (is_jwt_required){
        jwt = localStorage.getItem('jwt')
        user_id = localStorage.getItem('user_id')
        url = url + '?token=' + jwt + '&user_id=' + user_id
    }
    return axios.post(url, data)
}
