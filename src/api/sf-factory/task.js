import service from '@/utils/request'

export const factoryTaskList = (params) => {
    return service({
        url: "/sf-factory/task/list",
        method: 'get',
        params
    })
}

export const factoryTaskChangeCount = (data) => {
    return service({
        url: "/sf-factory/task/change_count",
        method: 'post',
        data
    })
}

export const factoryTaskConfirm = (data) => {
    return service({
        url: "/sf-factory/task/confirm",
        method: 'post',
        data
    })
}

export const factoryTaskPrint = (data) => {
    return service({
        url: "/sf-factory/task/print",
        method: 'post',
        data
    })
}

export const factoryTaskPrepare = (data) => {
    return service({
        url: "/sf-factory/task/prepare",
        method: 'post',
        data
    })
}

export const factoryTaskComplete = (data) => {
    return service({
        url: "/sf-factory/task/complete",
        method: 'post',
        data
    })
}

export const factoryTaskDelete = (data) => {
    return service({
        url: "/sf-factory/task/delete",
        method: 'post',
        data
    })
}

export const factoryTaskUploadTkBarcodeUrl = (data) => {
    return service({
        url: "/sf-factory/task/upload_tk_barcode_url",
        method: 'post',
        data
    })
}

export const factoryTaskUploadTemuBarcodeUrl = (data) => {
    return service({
        url: "/sf-factory/task/upload_temu_barcode_url",
        method: 'post',
        data
    })
}

export const factoryTaskChangeUrgentStatus = (data) => {
    return service({
        url: "/sf-factory/task/change_urgent_status",
        method: 'post',
        data
    })
}

export const factoryTaskCalcStatistics = (params) => {
    return service({
        url: "/sf-factory/task/calc_statistics",
        method: 'get',
        params
    })
}