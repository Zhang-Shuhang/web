import service from '@/utils/request'

// @Summary 产品列表
export const variationStockInfoList = (params) => {
    return service({
        url: "/temu/variation_stock_info/list",
        method: 'get',
        params
    })
}

// @Summary 产品列表
export const variationStockInfoSync = (data) => {
    return service({
        url: "/temu/variation_stock_info/sync",
        method: 'post',
        data
    })
}