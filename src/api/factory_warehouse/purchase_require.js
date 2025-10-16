import service from '@/utils/request'

export const factoryWarehousePurchaseRequireListByPage = (params) => {
    return service({
        url: "/factory_warehouse/purchase_require/list_by_page",
        method: 'get',
        params
    })
}

export const factoryWarehousePurchaseRequireCreate = (data) => {
    return service({
        url: "/factory_warehouse/purchase_require/create",
        method: 'post',
        data
    })
}

export const factoryWarehousePurchaseRequireUpdate = (data) => {
    return service({
        url: "/factory_warehouse/purchase_require/update",
        method: 'post',
        data
    })
}
