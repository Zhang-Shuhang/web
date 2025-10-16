import service from '@/utils/request'

export const factoryWarehouseInventoryLogListByPage = (params) => {
    return service({
        url: "/factory_warehouse/inventory_log/list_by_page",
        method: 'get',
        params
    })
}
