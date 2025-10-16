import service from '@/utils/request'

export const userList = (params) => {
    return service({
        url: "/temu/user/list",
        method: 'get',
        params
    })
}

export const userReLogin = (data) => {
    return service({
        url: "/temu/user/re_login",
        method: 'post',
        data
    })
}

export const userUpdate = (data) => {
    return service({
        url: "/temu/user/update",
        method: 'post',
        data
    })
}

export const userCheck = (data) => {
    return service({
        url: "/temu/user/check",
        method: 'post',
        data
    })
}