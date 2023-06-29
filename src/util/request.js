import {post, get, put, del} from "./service"
import login from "@/views/pages/login.vue";

export const loginApi = data => {
    return post({
        url: "/user/signIn",
        data
    })
}
// 获取用户列表
export const userListApi = data => {
    return get({
        url: "/user/getUser",
        data
    })
}

// 新增用户列表
export const userAddApi = data => {
    return put({
        url: "/user/addUser",
        data
    })
}
//  用户列表更改状态
export const userEditApi = data => {
    return post({
        url: "user/editUser",
        data
    })
}

// 删除用户
export const userDeleteApi = data => {
    return del({
        url: "user/delUser",
        data
    })
}



export const attendInfoListApi = data => {
    login
    return post({
        url: "attend/getAttendInfos",
        data
    })

}
export const faceListApi = data => {
    return get({
        url: "attend/getFaceLibraries",
        data
    })
}

export const addFaceApi = data => {
    return put({
        url: "attend/addFaceLibs",
        data
    })
}

export const deleteFaceApi = data => {
    return del({
        url: "attend/deleteFace",
        data
    })
}

export const restartApi = data => {
    return get({
        url: "attend/restart",
    })
}


