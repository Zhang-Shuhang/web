import service from '@/utils/request'

// @Summary 发货计划
export const deliveryList = (params) => {
    return service({
        url: "/shein/delivery/list",
        method: 'get',
        params
    })
}

// @Summary 设置首单
export const deliveryToFactory = (data) => {
    return service({
        url: "/shein/delivery/to_factory",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const deliveryToCustomize = (data) => {
    return service({
        url: "/shein/delivery/to_customize",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const deliverySync = (data) => {
    return service({
        url: "/shein/delivery/sync",
        method: 'post',
        data: data
    })
}

// @Summary 发货计划
export const deliveryItemList = (params) => {
    return service({
        url: "/shein/delivery/item_list",
        method: 'get',
        params
    })
}