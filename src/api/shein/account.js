import service from '@/utils/request'

export const accountList = (params) => {
    return service({
        url: "/shein/account/list",
        method: 'get',
        unloading: true,
        params
    })
}

export const accountUpdate = (data) => {
    return service({
        url: "/shein/account/update",
        method: 'post',
        data
    })
}

export const accountCreate = (data) => {
    return service({
        url: "/shein/account/create",
        method: 'post',
        data
    })
}

export const accountDelete = (data) => {
    return service({
        url: "/shein/account/delete",
        method: 'post',
        data
    })
}