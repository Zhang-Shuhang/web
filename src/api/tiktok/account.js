import service from '@/utils/request'

export const accountList = (params) => {
    return service({
        url: "/tiktok/account/list",
        method: 'get',
        unloading: true,
        params
    })
}

export const accountUpdate = (data) => {
    return service({
        url: "/tiktok/account/update",
        method: 'post',
        data
    })
}

export const accountCreate = (data) => {
    return service({
        url: "/tiktok/account/create",
        method: 'post',
        data
    })
}

export const accountDelete = (data) => {
    return service({
        url: "/tiktok/account/delete",
        method: 'post',
        data
    })
}