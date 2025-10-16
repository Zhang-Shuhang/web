import service from '@/utils/request'

export const itemList = (params) => {
    return service({
        url: "/mkd/item/list",
        method: 'get',
        params
    })
}

export const itemStatusList = (params) => {
    return service({
        url: "/mkd/item/status",
        method: 'get',
        params
    })
}