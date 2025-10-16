import service from '@/utils/request'

export const accessoryListByPage = (params) => {
    return service({
        url: "/product_sys/accessory/list_by_page",
        method: 'get',
        params
    })
}

export const accessoryList = (params) => {
    return service({
        url: "/product_sys/accessory/list",
        method: 'get',
        params
    })
}

export const accessoryLoad = (params) => {
    return service({
        url: "/product_sys/accessory/load",
        method: 'get',
        params
    })
}

export const accessoryCreate = (data) => {
    return service({
        url: "/product_sys/accessory/create",
        method: 'post',
        data
    })
}

export const accessoryUpdate = (data) => {
    return service({
        url: "/product_sys/accessory/update",
        method: 'post',
        data
    })
}
