import service from '@/utils/request'

export const techListByPage = (params) => {
    return service({
        url: "/product_sys/tech/list_by_page",
        method: 'get',
        params
    })
}

export const techList = (params) => {
    return service({
        url: "/product_sys/tech/list",
        method: 'get',
        params
    })
}

export const techLoad = (params) => {
    return service({
        url: "/product_sys/tech/load",
        method: 'get',
        params
    })
}

export const techCreate = (data) => {
    return service({
        url: "/product_sys/tech/create",
        method: 'post',
        data
    })
}

export const techUpdate = (data) => {
    return service({
        url: "/product_sys/tech/update",
        method: 'post',
        data
    })
}
