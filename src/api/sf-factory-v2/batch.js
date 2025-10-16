import service from '@/utils/request'

export const factoryBatchList = (params) => {
    return service({
        url: "/sf-factory-v2/batch/list",
        method: 'get',
        params
    })
}

export const factoryBatchPackageList = (params) => {
    return service({
        url: "/sf-factory-v2/batch/package_list",
        method: 'get',
        params
    })
}

export const factoryBatchCancel = (data) => {
    return service({
        url: "/sf-factory-v2/batch/cancel",
        method: 'post',
        data
    })
}

export const factoryBatchItem = (data) => {
    return service({
        url: "/sf-factory-v2/batch/item",
        method: 'post',
        data
    })
}

export const factoryBatchItemV2LoadOrComplete = (data) => {
    return service({
        url: "/sf-factory-v2/batch/item_v2/load_or_complete",
        method: 'post',
        data
    })
}

export const factoryBatchItemV2Complete = (data) => {
    return service({
        url: "/sf-factory-v2/batch/item_v2/complete",
        method: 'post',
        data
    })
}

export const factoryBatchItems = (data) => {
    return service({
        url: "/sf-factory-v2/batch/items",
        method: 'post',
        data
    })
}

export const factoryBatchItemsExport = (data) => {
    return service({
        url: "/sf-factory-v2/batch/items_export",
        method: 'post',
        data
    })
}

export const factoryBatchGetItem = (params) => {
    return service({
        url: "/sf-factory-v2/batch/item",
        method: 'get',
        params
    })
}

export const factoryBatchPackage = (data) => {
    return service({
        url: "/sf-factory-v2/batch/package",
        method: 'post',
        data
    })
}

export const factoryBatchResetPackage = (data) => {
    return service({
        url: "/sf-factory-v2/batch/reset_package",
        method: 'post',
        data
    })
}

export const factoryBatchHide = (data) => {
    return service({
        url: "/sf-factory-v2/batch/hide",
        method: 'post',
        data
    })
}

export const factoryBatchNotifyNoDiagram = (data) => {
    return service({
        url: "/sf-factory-v2/batch/notify_no_diagram",
        method: 'post',
        data
    })
}
