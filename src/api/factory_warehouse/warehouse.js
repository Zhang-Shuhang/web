import service from '@/utils/request'

export const factoryWarehouseWarehouseList = (params) => {
    return service({
        url: "/factory_warehouse/warehouse/list",
        method: 'get',
        params
    })
}

export const factoryWarehouseWarehouseCreate = (data) => {
    return service({
        url: "/factory_warehouse/warehouse/create",
        method: 'post',
        data
    })
}

export const factoryWarehouseWarehouseUpdate = (data) => {
    return service({
        url: "/factory_warehouse/warehouse/update",
        method: 'post',
        data
    })
}
