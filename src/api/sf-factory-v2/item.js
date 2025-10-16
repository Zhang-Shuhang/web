import service from '@/utils/request'

export const factoryItemList = (params) => {
    return service({
        url: "/sf-factory-v2/item/list",
        method: 'get',
        params
    })
}

export const factoryItemBarcodeUrl = (params) => {
    return service({
        url: "/sf-factory-v2/item/barcode_url",
        method: 'get',
        params
    })
}

export const factoryItemUpload = (data) => {
    return service({
        url: "/sf-factory-v2/item/upload",
        method: 'post',
        data
    })
}

export const factoryItemUploadUrl = (data) => {
    return service({
        url: "/sf-factory-v2/item/upload_url",
        method: 'post',
        data
    })
}

export const factoryItemOneKeyGenBarcode = (data) => {
    return service({
        url: "/sf-factory-v2/item/one_key_gen_barcode",
        method: 'post',
        data
    })
}