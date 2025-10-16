import service from '@/utils/request'

// @Summary 发货计划
export const variationList = (params) => {
    return service({
        url: "/tiktok/variation/list",
        method: 'get',
        params
    })
}

// @Summary 每日列表
export const variationDailyList = (params) => {
    return service({
        url: "/tiktok/variation/daily_list",
        method: 'get',
        params
    })
}

// @Summary 设置首单
export const variationFirstOrder = (data) => {
    return service({
        url: "/tiktok/variation/first_order",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const variationAddBuyRecord = (data) => {
    return service({
        url: "/tiktok/variation/add_buy_record",
        method: 'post',
        data: data
    })
}

// @Summary 创建备货
export const variationCreateRequisition = (data) => {
    return service({
        url: "/tiktok/variation/create_requisition",
        method: 'post',
        data: data
    })
}
