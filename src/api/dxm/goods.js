import service from '@/utils/request'

// @Summary 发货计划
export const dxmGoodsList = (params) => {
    return service({
        url: "/dxm/dxm_goods/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const dxmGoodsId = (params) => {
    return service({
        url: "/dxm/dxm_goods/id",
        method: 'get',
        params
    })
}