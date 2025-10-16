import service from '@/utils/request'

// @Summary 发货计划
export const dxmTiktokSearch = (params) => {
    return service({
        url: "/dxm/tk/search",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const dxmTiktokLoad = (params) => {
    return service({
        url: "/dxm/tk/load",
        method: 'get',
        params
    })
}