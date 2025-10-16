import service from '@/utils/request'

// @Summary 发货计划
export const deliveryList = (params) => {
    return service({
        url: "/tiktok/delivery/list",
        method: 'get',
        params
    })
}

// @Summary 设置首单
export const deliveryToFactory = (data) => {
    return service({
        url: "/tiktok/delivery/to_factory",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const deliverySync = (data) => {
    return service({
        url: "/tiktok/delivery/sync",
        method: 'post',
        data: data
    })
}
