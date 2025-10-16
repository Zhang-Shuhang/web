import service from '@/utils/request'

// @Summary 发货计划
export const variationList = (params) => {
    return service({
        url: "/shein/variation/list",
        method: 'get',
        params
    })
}

// @Summary 每日列表
export const variationDailyList = (params) => {
    return service({
        url: "/shein/variation/daily_list",
        method: 'get',
        params
    })
}

// @Summary 设置首单
export const variationFirstOrder = (data) => {
    return service({
        url: "/shein/variation/first_order",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const variationAddBuyRecord = (data) => {
    return service({
        url: "/shein/variation/add_buy_record",
        method: 'post',
        data: data
    })
}

// @Summary 锁掉
export const variationBan = (data) => {
    return service({
        url: "/shein/variation/ban",
        method: 'post',
        data: data
    })
}
