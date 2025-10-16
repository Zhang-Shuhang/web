import service from '@/utils/request'

// @Summary 发货计划
export const productList = (params) => {
    return service({
        url: "/shein/product/list",
        method: 'get',
        params
    })
}

// @Summary 每日列表
export const productDailyList = (params) => {
    return service({
        url: "/shein/product/daily_list",
        method: 'get',
        params
    })
}

// @Summary 设置首单
export const productFirstOrder = (data) => {
    return service({
        url: "/shein/product/first_order",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const productAddBuyRecord = (data) => {
    return service({
        url: "/shein/product/add_buy_record",
        method: 'post',
        data: data
    })
}
