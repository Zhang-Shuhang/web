import service from '@/utils/request'

// @Summary 发货台同步
export const purchasePunishList = (params) => {
    return service({
        url: "/temu/purchase_punish/list",
        method: 'get',
        params
    })
}

// @Summary 发货台同步
export const purchasePunishQuery = (params) => {
    return service({
        url: "/temu/purchase_punish/query",
        method: 'get',
        params
    })
}

// @Summary 发货台同步
export const purchasePunishSync = (data) => {
    return service({
        url: "/temu/purchase_punish/sync",
        method: 'post',
        data
    })
}

// @Summary 发货台同步
export const purchasePunishReply = (data) => {
    return service({
        url: "/temu/purchase_punish/reply",
        method: 'post',
        data
    })
}
