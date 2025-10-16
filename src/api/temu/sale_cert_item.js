import service from '@/utils/request'

// @Summary 订单列表
export const certItemList = (params) => {
    return service({
        url: "/temu/sale_cert_item/list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const certItemCertTypeList = (params) => {
    return service({
        url: "/temu/sale_cert_item/cert_list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const certItemDetail = (params) => {
    return service({
        url: "/temu/sale_cert_item/detail",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const certItemSync = (params) => {
    return service({
        url: "/temu/sale_cert_item/sync",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const certItemUpload = (data) => {
    return service({
        url: "/temu/sale_cert_item/upload",
        method: 'post',
        data,
    })
}