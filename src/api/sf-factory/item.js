import service from '@/utils/request'

export const factoryItemList = (params) => {
    return service({
        url: "/sf-factory/item/list",
        method: 'get',
        params
    })
}

export const factoryItemBarcodeUrl = (params) => {
    return service({
        url: "/sf-factory/item/barcode_url",
        method: 'get',
        params
    })
}

export const factoryItemUpload = (data) => {
    return service({
        url: "/sf-factory/item/upload",
        method: 'post',
        data
    })
}

export const factoryItemUploadUrl = (data) => {
    return service({
        url: "/sf-factory/item/upload_url",
        method: 'post',
        data
    })
}