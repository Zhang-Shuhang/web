import service from '@/utils/request'

// @Summary 查询
export const query = (params) => {
    return service({
        url: "/temu/stock/query",
        method: 'get',
        params
    })
}

// @Summary 查询
export const queryByDxmSku = (params) => {
    return service({
        url: "/temu/stock/query_by_dxm_sku",
        method: 'get',
        params
    })
}

// @Summary 查询
export const stockBatch = (params) => {
    return service({
        url: "/temu/stock/batch",
        method: 'get',
        params
    })
}

// @Summary 创建
export const create = (data) => {
    return service({
        url: "/temu/stock/create",
        method: 'post',
        data
    })
}
// @Summary 创建
export const stockSync = () => {
    return service({
        url: "/temu/stock/sync",
        method: 'get'
    })
}