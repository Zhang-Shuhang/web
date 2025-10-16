import service from '@/utils/request'

// @Summary 列表
export const customizeSemiOrderList = (params) => {
    return service({
        url: "/customize_v3/semi/list",
        method: 'get',
        params
    })
}

// @Summary 同步
export const customizeSemiOrderSync = (params) => {
    return service({
        url: "/customize_v3/semi/sync",
        method: 'get',
        params
    })
}