import service from '@/utils/request'

// @Summary 产品列表
export const productList = (params) => {
    return service({
        url: "/temu/product/list",
        method: 'get',
        params
    })
}

// @Summary 产品同步
export const productSync = (data) => {
    return service({
        url: "/temu/product/sync",
        method: 'post',
        data
    })
}

// @Summary 产品同步
export const productOpenJit = (data) => {
    return service({
        url: "/temu/product/open_jit",
        method: 'post',
        data
    })
}

export const productQueryCustomizeImages = (data) => {
    return service({
        url: "/temu/product/query_customize_images",
        method: 'post',
        data
    })
}

export const productCustomizeEdit = (data) => {
    return service({
        url: "/temu/product/customize_edit",
        method: 'post',
        data
    })
}
export const productBatchEditShipment = (data) => {
    return service({
        url: "/temu/product/batch_edit_shipment",
        method: 'post',
        data
    })
}

// @Summary 一键迁移
export const productOneKeyTransport = (params) => {
    return service({
        url: "/temu/product/one_key_transport",
        method: 'get',
        params
    })
}

export const productBatchVideos = (data) => {
    return service({
        url: "/temu/product/batch_videos",
        method: 'post',
        data
    })
}

// @Summary 搜索限制
export const productSearchLimit = (params) => {
    return service({
        url: "/temu/product/search_limit",
        method: 'get',
        params
    })
}

// @Summary 搜索限制
export const productImageListBySkuCode = (params) => {
    return service({
        url: "/temu/product/image_list_by_sku_code",
        method: 'get',
        params
    })
}

// @Summary 搜索限制
export const productUpdateAutoHandleSearchLimit = (data) => {
    return service({
        url: "/temu/product/update_auto_handle_search_limit",
        method: 'post',
        data
    })
}

// @Summary 搜索限制
export const productSearchLimitSelfCompare = (params) => {
    return service({
        url: "/temu/product/export_search_limit_self_compare",
        method: 'get',
        params
    })
}