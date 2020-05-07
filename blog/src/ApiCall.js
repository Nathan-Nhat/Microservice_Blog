import axios from 'axios'

export function get_data(url, is_jwt_required) {
    var jwt = null
    var username = null
    if (is_jwt_required){
        jwt = localStorage.getItem('jwt')
        username = localStorage.getItem('username')
        url = url + '?token=' + jwt + '&username=' + username
    }
    return axios.get(url)
}