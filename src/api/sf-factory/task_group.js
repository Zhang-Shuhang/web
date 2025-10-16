import service from '@/utils/request'

export const factoryTaskGroupBarcodeUrl = (params) => {
    return service({
        url: "/sf-factory/task_group/barcode_url",
        method: 'get',
        params
    })
}