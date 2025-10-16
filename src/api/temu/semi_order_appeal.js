import service from '@/utils/request'

// @Summary 订单列表
export const semiOrderAppealList = (params) => {
    return service({
        url: "/temu/semi_order_appeal/list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderAppealLoad = (params) => {
    return service({
        url: "/temu/semi_order_appeal/load",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderAppealSync = (data) => {
    return service({
        url: "/temu/semi_order_appeal/sync",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderAppealSubmit = (data) => {
    return service({
        url: "/temu/semi_order_appeal/submit",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderAppealUploadImage = (data) => {
    return service({
        url: "/temu/semi_order_appeal/upload_image",
        method: 'post',
        data
    })
}