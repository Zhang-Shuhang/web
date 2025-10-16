import service from '@/utils/request'

export const accountList = (params) => {
    return service({
        url: "/temu/account/list",
        method: 'get',
        unloading: true,
        params
    })
}

export const accountListForEdit = (params) => {
    return service({
        url: "/temu/account/list_for_edit",
        method: 'get',
        params
    })
}

export const accountToken = (params) => {
    return service({
        url: "/temu/account/token",
        method: 'get',
        params
    })
}

export const accountUpdate = (data) => {
    return service({
        url: "/temu/account/update",
        method: 'post',
        data
    })
}

export const accountUpdateDiscard = (data) => {
    return service({
        url: "/temu/account/update_discard",
        method: 'post',
        data
    })
}

export const accountUpdateByMap = (data) => {
    return service({
        url: "/temu/account/update_by_map",
        method: 'post',
        data
    })
}

export const accountCreate = (data) => {
    return service({
        url: "/temu/account/create",
        method: 'post',
        data
    })
}

export const accountDelete = (data) => {
    return service({
        url: "/temu/account/delete",
        method: 'post',
        data
    })
}

export const accountWhiteRedirect = (data) => {
    return service({
        url: "/temu/account/white_redirect",
        method: 'post',
        data
    })
}