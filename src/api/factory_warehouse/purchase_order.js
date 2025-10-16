import service from '@/utils/request'

export const factoryWarehousePurchaseOrderListByPage = (params) => {
    return service({
        url: "/factory_warehouse/purchase_order/list_by_page",
        method: 'get',
        params
    })
}

export const factoryWarehousePurchaseOrderCreate = (data) => {
    return service({
        url: "/factory_warehouse/purchase_order/create",
        method: 'post',
        data
    })
}

export const factoryWarehousePurchaseOrderCreateFromDxm = (data) => {
    return service({
        url: "/factory_warehouse/purchase_order/create_from_dxm",
        method: 'post',
        data
    })
}

export const factoryWarehousePurchaseOrderUpdate = (data) => {
    return service({
        url: "/factory_warehouse/purchase_order/update",
        method: 'post',
        data
    })
}

export const factoryWarehousePurchaseOrderSyncTrackingNumbers = (data) => {
    return service({
        url: "/factory_warehouse/purchase_order/sync_tracking_numbers",
        method: 'post',
        data
    })
}

export const factoryWarehousePurchaseOrderSyncDelete = (data) => {
    return service({
        url: "/factory_warehouse/purchase_order/delete",
        method: 'post',
        data
    })
}