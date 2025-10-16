import service from '@/utils/request'

// @Summary 发货计划
export const dxmOverseaWarehouseList = (params) => {
    return service({
        url: "/dxm/dxm_oversea_warehouse/list",
        method: 'get',
        params
    })
}