import service from '@/utils/request'

// @Summary 发货计划
export const customizeDeliveryOrdersList = (params) => {
    return service({
        url: "/customize_v2/delivery_order/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeDeliveryOrdersPbList = (params) => {
    return service({
        url: "/customize_v2/delivery_order/pb_list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeDeliveryOrdersSync = (params) => {
    return service({
        url: "/customize_v2/delivery_order/sync",
        method: 'get',
        params
    })
}

// @Summary 排版
export const customizeDeliveryOrdersPb = (data) => {
    return service({
        url: "/customize_v2/delivery_order/pb",
        method: 'post',
        data
    })
}
