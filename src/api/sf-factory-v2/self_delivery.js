import service from '@/utils/request'

export const selfDeliveryList = (params) => {
    return service({
        url: "/sf-factory-v2/self_delivery/list",
        method: 'get',
        params
    })
}

export const selfDeliveryWarehouseList = (params) => {
    return service({
        url: "/sf-factory-v2/self_delivery/warehouse_list",
        method: 'get',
        params
    })
}

export const selfDeliveryNotShippedCount = (params) => {
    return service({
        url: "/sf-factory-v2/self_delivery/not_shipped_count",
        method: 'get',
        params
    })
}

export const selfDeliveryAllNotShippedCount = (data) => {
    return service({
        url: "/sf-factory-v2/self_delivery/all_not_shipped_count",
        method: 'post',
        data
    })
}

export const selfDeliveryPrint = (data) => {
    return service({
        url: "/sf-factory-v2/self_delivery/print",
        method: 'post',
        data
    })
}

export const selfDeliveryAddToList = (data) => {
    return service({
        url: "/sf-factory-v2/self_delivery/add_to_list",
        method: 'post',
        data
    })
}

export const selfDeliveryBroke = (data) => {
    return service({
        url: "/sf-factory-v2/self_delivery/broke",
        method: 'post',
        data
    })
}