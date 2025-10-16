import service from '@/utils/request'

// @Summary 发货计划
export const customizeOrderList = (params) => {
    return service({
        url: "/customize_v2/order/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeOrderLoad = (params) => {
    return service({
        url: "/customize_v2/order/load",
        method: 'get',
        params
    })
}

// @Summary 排版
export const customizeOrderPb = (data) => {
    return service({
        url: "/customize_v2/order/pb",
        method: 'post',
        data
    })
}

// @Summary 排版
export const customizeOrderMarkComplete = (data) => {
    return service({
        url: "/customize_v2/order/mark_complete",
        method: 'post',
        data
    })
}


// @Summary 排版
export const customizeOrderSet = (data) => {
    return service({
        url: "/customize_v2/order/set_customize",
        method: 'post',
        data
    })
}

export const customizeOrderUpdate = (data) => {
    return service({
        url: "/customize_v2/order/update",
        method: 'post',
        data
    })
}

export const customizeOrderGen = (data) => {
    return service({
        url: "/customize_v2/order/gen",
        method: 'post',
        data
    })
}

export const customizeOrderPreview = (data) => {
    return service({
        url: "/customize_v2/order/preview",
        method: 'post',
        data
    })
}