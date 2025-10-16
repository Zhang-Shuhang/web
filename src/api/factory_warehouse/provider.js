import service from '@/utils/request'

export const factoryWarehouseProviderList = (params) => {
    return service({
        url: "/factory_warehouse/provider/list",
        method: 'get',
        params
    })
}

export const factoryWarehouseProviderListByPage = (params) => {
    return service({
        url: "/factory_warehouse/provider/list_by_page",
        method: 'get',
        params
    })
}

export const factoryWarehouseProviderCreate = (data) => {
    return service({
        url: "/factory_warehouse/provider/create",
        method: 'post',
        data
    })
}

export const factoryWarehouseProviderUpdate = (data) => {
    return service({
        url: "/factory_warehouse/provider/update",
        method: 'post',
        data
    })
}
