import service from '@/utils/request'

// @Summary 产品列表
export const variationReplyPrice = (data) => {
    return service({
        url: "/temu/variation/reply_price",
        method: 'post',
        data
    })
}

// @Summary 产品列表
export const variationRejectPrice = (data) => {
    return service({
        url: "/temu/variation/reject_price",
        method: 'post',
        data
    })
}

// @Summary 产品列表
export const variationGetPriceRange = (params) => {
    return service({
        url: "/temu/variation/get_price_range",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const variationExport = (params) => {
    return service({
        url: "/temu/variation/export",
        method: 'get',
        params
    })
}