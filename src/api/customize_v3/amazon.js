import service from '@/utils/request'

// @Summary 发货计划
export const customizeAmazonOrderList = (params) => {
    return service({
        url: "/customize_v3/amazon/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeAmazonOrderPbList = (params) => {
    return service({
        url: "/customize_v3/amazon/pb_list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeAmazonOrderSync = (params) => {
    return service({
        url: "/customize_v3/amazon/sync",
        method: 'get',
        params
    })
}

// @Summary 排版
export const customizeAmazonOrderPb = (data) => {
    return service({
        url: "/customize_v3/amazon/pb",
        method: 'post',
        data
    })
}
