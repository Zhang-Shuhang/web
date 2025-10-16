import service from '@/utils/request'

// @Summary 生成编码文件
export const simpleProductList = (params) => {
    return service({
        url: "/temu/simple_product/list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductCreateBySaleItem = (params) => {
    return service({
        url: "/temu/simple_product/create_by_sale_item",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplateListSimple = (params) => {
    return service({
        url: "/temu/simple_product/template_list_simple",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTechnologyList = (params) => {
    return service({
        url: "/temu/simple_product/technology",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductAccessoryPageQuery = (params) => {
    return service({
        url: "/temu/simple_product/accessory_page_query",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplateList = (params) => {
    return service({
        url: "/temu/simple_product/template_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplate = (params) => {
    return service({
        url: "/temu/simple_product/template",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplates = (params) => {
    return service({
        url: "/temu/simple_product/templates",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductTemplateListByPage = (params) => {
    return service({
        url: "/temu/simple_product/template_list_by_page",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductUploadList = (params) => {
    return service({
        url: "/temu/simple_product/upload_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductUploadRecordList = (params) => {
    return service({
        url: "/temu/simple_product/upload_record_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductUpload = (data) => {
    return service({
        url: "/temu/simple_product/upload",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductCombineUpload = (data) => {
    return service({
        url: "/temu/simple_product/combine_upload",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductUploadZf = (data) => {
    return service({
        url: "/temu/simple_product/upload_zf",
        method: 'post',
        data
    })
}



// @Summary 生成编码文件
export const simpleProductUploadRetry = (data) => {
    return service({
        url: "/temu/simple_product/upload_retry",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductZf = (data) => {
    return service({
        url: "/temu/simple_product/zf",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductTagList = (params) => {
    return service({
        url: "/temu/simple_product/tag_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductCategorySearch = (params) => {
    return service({
        url: "/temu/simple_product/category_search",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductCategorySizeSpecMeta = (params) => {
    return service({
        url: "/temu/simple_product/size_spec_meta",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductCategoryTemplateQuery = (params) => {
    return service({
        url: "/temu/simple_product/category_template_query",
        method: 'get',
        params
    })
}



// @Summary 生成编码文件
export const simpleProductSkuSpecParentList = (params) => {
    return service({
        url: "/temu/simple_product/sku_spec_parent_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const simpleProductQueryOrAddSpecs = (data) => {
    return service({
        url: "/temu/simple_product/query_or_add_specs",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductSaveTemplate = (data) => {
    return service({
        url: "/temu/simple_product/save_template",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductDeleteTemplate = (data) => {
    return service({
        url: "/temu/simple_product/delete_template",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductExportTiktokExcel = (data) => {
    return service({
        url: "/temu/simple_product/export_tiktok_excel",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductExportTemuExcel = (data) => {
    return service({
        url: "/temu/simple_product/export_temu_excel",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductExportBlindExcel = (data) => {
    return service({
        url: "/temu/simple_product/export_blind_excel",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductUpdateUpload = (data) => {
    return service({
        url: "/temu/simple_product/update_upload",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductOneKeyTransportUpload = (data) => {
    return service({
        url: "/temu/simple_product/one_key_transport_upload",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const simpleProductUploadChangeCategory = (data) => {
    return service({
        url: "/temu/simple_product/upload_change_category",
        method: 'post',
        data
    })
}
