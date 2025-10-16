import service from '@/utils/request'

// @Summary 发货计划
export const customizeOrderList = (params) => {
    return service({
        url: "/customize_v3/order/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeOrderLoad = (params) => {
    return service({
        url: "/customize_v3/order/load",
        method: 'get',
        params
    })
}

// @Summary 排版
export const customizeOrderPb = (data) => {
    return service({
        url: "/customize_v3/order/pb",
        method: 'post',
        data
    })
}

// @Summary 排版
export const customizeOrderMarkComplete = (data) => {
    return service({
        url: "/customize_v3/order/mark_complete",
        method: 'post',
        data
    })
}


// @Summary 排版
export const customizeOrderSet = (data) => {
    return service({
        url: "/customize_v3/order/set_customize",
        method: 'post',
        data
    })
}

export const customizeOrderUpdate = (data) => {
    return service({
        url: "/customize_v3/order/update",
        method: 'post',
        data
    })
}

export const customizeOrderGen = (data) => {
    return service({
        url: "/customize_v3/order/gen",
        method: 'post',
        data
    })
}

export const customizeOrderPreview = (data) => {
    return service({
        url: "/customize_v3/order/preview",
        method: 'post',
        data
    })
}

export const customizeOrderExport = (data) => {
    return service({
        url: "/customize_v3/order/export",
        method: 'post',
        data
    })
}

export const customizeOrderMatch = (data) => {
    return service({
        url: "/customize_v3/order/match",
        method: 'post',
        data
    })
}

export const customizeOrderGenJsx = (data) => {
    return service({
        url: "/customize_v3/order/gen_jsx",
        method: 'post',
        data
    })
}

export const customizeOrderCrossword = (data) => {
    return service({
        url: "/customize_v3/order/crossword",
        method: 'post',
        data
    })
}

export const customizeOrderExportList = (params) => {
    return service({
        url: "/customize_v3/order/export_list",
        method: 'get',
        params
    })
}