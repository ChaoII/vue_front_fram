export default {
    state: {
        userInfo: ((localStorage.getItem("loginData") && JSON.parse(localStorage.getItem("loginData"))) || {})
    },
    mutations: {
        setToken(state, user) {
            state.userInfo = user.data
        }
    }
}