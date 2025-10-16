import service from '@/utils/request'

export const factoryWarehousePurchaseOrderLogListByPage = (params) => {
    return service({
        url: "/factory_warehouse/purchase_order_log/list_by_page",
        method: 'get',
        params
    })
}