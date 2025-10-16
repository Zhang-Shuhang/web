import service from '@/utils/request'

export const factoryBarcodeList = (params) => {
    return service({
        url: "/sf-factory-v2/barcode/list",
        method: 'get',
        params
    })
}

export const factoryBarcodeListByPage = (params) => {
    return service({
        url: "/sf-factory-v2/barcode/list_by_page",
        method: 'get',
        params
    })
}