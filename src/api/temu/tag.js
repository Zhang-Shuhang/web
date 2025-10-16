import service from '@/utils/request'

// @Summary 发货台同步
export const tagList = (params) => {
    return service({
        url: "/temu/tag/list",
        method: 'get',
        params
    })
}

// @Summary 发货台同步
export const tagAdd = (data) => {
    return service({
        url: "/temu/tag/add",
        method: 'post',
        data
    })
}

// @Summary 发货台同步
export const tagRemove = (data) => {
    return service({
        url: "/temu/tag/remove",
        method: 'post',
        data
    })
}
