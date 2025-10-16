import service from '@/utils/request'

// @Summary 发货计划
export const priceAdjustList = (params) => {
    return service({
        url: "/temu/price_adjust/list",
        method: 'get',
        params
    })
}

// @Summary 拒绝
export const priceAdjustReply = (data) => {
    return service({
        url: "/temu/price_adjust/reply",
        method: 'post',
        data
    })
}

// @Summary 拒绝
export const priceAdjustSync = () => {
    return service({
        url: "/temu/price_adjust/sync",
        method: 'post'
    })
}

// @Summary 拒绝
export const priceAdjustRejectById = (data) => {
    return service({
        url: "/temu/price_adjust/reject_by_id",
        method: 'post',
        data
    })
}
