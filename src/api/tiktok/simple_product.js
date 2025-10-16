import service from '@/utils/request'

// @Summary 生成编码文件
export const simpleProductList = (params) => {
    return service({
        url: "/tiktok/simple_product/list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplateListSimple = (params) => {
    return service({
        url: "/tiktok/simple_product/template_list_simple",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplateList = (params) => {
    return service({
        url: "/tiktok/simple_product/template_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplate = (params) => {
    return service({
        url: "/tiktok/simple_product/template",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplates = (params) => {
    return service({
        url: "/tiktok/simple_product/templates",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplateListByPage = (params) => {
    return service({
        url: "/tiktok/simple_product/template_list_by_page",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductUploadList = (params) => {
    return service({
        url: "/tiktok/simple_product/upload_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductUploadRecordList = (params) => {
    return service({
        url: "/tiktok/simple_product/upload_record_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductUpload = (data) => {
    return service({
        url: "/tiktok/simple_product/upload",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductCombineUpload = (data) => {
    return service({
        url: "/tiktok/simple_product/combine_upload",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductUploadRetry = (data) => {
    return service({
        url: "/tiktok/simple_product/upload_retry",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductZf = (data) => {
    return service({
        url: "/tiktok/simple_product/zf",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductTagList = (params) => {
    return service({
        url: "/tiktok/simple_product/tag_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductSaveTemplate = (data) => {
    return service({
        url: "/tiktok/simple_product/save_template",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductDeleteTemplate = (data) => {
    return service({
        url: "/tiktok/simple_product/delete_template",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductUpdateUpload = (data) => {
    return service({
        url: "/tiktok/simple_product/update_upload",
        method: 'post',
        data
    })
}
