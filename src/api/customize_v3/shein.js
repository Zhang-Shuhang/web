import service from '@/utils/request'

// @Summary 发货计划
export const customizeSheinOrderList = (params) => {
    return service({
        url: "/customize_v3/shein/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeSheinOrderPbList = (params) => {
    return service({
        url: "/customize_v3/shein/pb_list",
        method: 'get',
        params
    })
}

// @Summary 排版
export const customizeSheinOrderPb = (data) => {
    return service({
        url: "/customize_v3/shein/pb",
        method: 'post',
        data
    })
}
