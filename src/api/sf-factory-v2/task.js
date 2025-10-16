import service from '@/utils/request'

export const factoryTaskChangeCount = (data) => {
    return service({
        url: "/sf-factory-v2/task/change_count",
        method: 'post',
        data
    })
}
export const factoryTaskBarcodeUrl = (params) => {
    return service({
        url: "/sf-factory-v2/task/barcode_url",
        method: 'get',
        params
    })
}

export const factoryTaskComplete = (data) => {
    return service({
        url: "/sf-factory-v2/task/complete",
        method: 'post',
        data
    })
}