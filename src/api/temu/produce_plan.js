import service from '@/utils/request'

// @Summary 发货台同步
export const producePlanList = (params) => {
    return service({
        url: "/temu/produce_plan/list",
        method: 'get',
        params
    })
}

// @Summary 发货台同步
export const producePlanUpdate = (data) => {
    return service({
        url: "/temu/produce_plan/update_status",
        method: 'post',
        data
    })
}

// @Summary 发货台同步
export const producePlanSync = (data) => {
    return service({
        url: "/temu/produce_plan/sync",
        method: 'post',
        data
    })
}
