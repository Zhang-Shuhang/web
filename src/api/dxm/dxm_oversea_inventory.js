import service from '@/utils/request'

// @Summary 发货计划
export const dxmOverseaInventoryStock = (params) => {
    return service({
        url: "/dxm/dxm_oversea_inventory/stock",
        method: 'get',
        params
    })
}