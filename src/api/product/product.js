import service from '@/utils/request'

export const productBigDiagramList = (params) => {
    return service({
        url: "/product_sys/product/big_diagram_list",
        method: 'get',
        params
    })
}

export const productList = (params) => {
    return service({
        url: "/product_sys/product/list",
        method: 'get',
        params
    })
}

export const productListByPage = (params) => {
    return service({
        url: "/product_sys/product/list_by_page",
        method: 'get',
        params
    })
}

export const productLoad = (params) => {
    return service({
        url: "/product_sys/product/load",
        method: 'get',
        params
    })
}

export const productUpdate = (data) => {
    return service({
        url: "/product_sys/product/update",
        method: 'post',
        data
    })
}

export const productImageList = (params) => {
    return service({
        url: "/product_sys/product/image_list",
        method: 'get',
        params
    })
}

export const productImageFromProduct = (params) => {
    return service({
        url: "/product_sys/product/image_from_product",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const productAddTag = (data) => {
    return service({
        url: "/product_sys/product/add_tag",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const productRemoveTag = (data) => {
    return service({
        url: "/product_sys/product/remove_tag",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const productHide = (data) => {
    return service({
        url: "/product_sys/product/hide",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const productReviewOk = (data) => {
    return service({
        url: "/product_sys/product/review_ok",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const productDownloadDiagram = (data) => {
    return service({
        url: "/product_sys/product/download_diagram",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const productCreate = (data) => {
    return service({
        url: "/product_sys/product/create",
        method: 'post',
        data
    })
}