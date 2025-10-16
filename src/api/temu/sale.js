import service from '@/utils/request'

// @Summary 发货计划
export const saleList = (params) => {
    return service({
        url: "/temu/sale/list",
        method: 'get',
        params
    })
}

export const saleCert = (params) => {
    return service({
        url: "/temu/sale/cert",
        method: 'get',
        params
    })
}

export const saleCountryRecords = (params) => {
    return service({
        url: "/temu/sale/country_records",
        method: 'get',
        params
    })
}

export const saleQueryForImage = (params) => {
    return service({
        url: "/temu/sale/query_for_image",
        method: 'get',
        params
    })
}

export const saleQueryImagesForEdit = (params) => {
    return service({
        url: "/temu/sale/query_images_for_edit",
        method: 'get',
        params
    })
}

export const saleImageEdit = (data) => {
    return service({
        url: "/temu/sale/image_edit",
        method: 'post',
        data
    })
}

export const saleCustomizeEdit = (data) => {
    return service({
        url: "/temu/sale/customize_edit",
        method: 'post',
        data
    })
}

export const saleDownloadImages = (data) => {
    return service({
        url: "/temu/sale/download_images",
        method: 'post',
        data
    })
}

export const saleQueryImages = (params) => {
    return service({
        url: "/temu/sale/query_images",
        method: 'get',
        params
    })
}