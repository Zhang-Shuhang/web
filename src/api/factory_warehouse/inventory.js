import service from '@/utils/request'

export const factoryWarehouseInventoryListByPage = (params) => {
    return service({
        url: "/factory_warehouse/inventory/list_by_page",
        method: 'get',
        params
    })
}

export const factoryWarehouseInventoryUpdate = (data) => {
    return service({
        url: "/factory_warehouse/inventory/update",
        method: 'post',
        data
    })
}
