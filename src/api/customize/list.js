import service from '@/utils/request'

// @Summary 发货计划
export const customizeList = (params) => {
    return service({
        url: "/customize_v2/base/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeImageBase64 = (params) => {
    return service({
        url: "/customize_v2/base/image_base64",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeLoad = (params) => {
    return service({
        url: "/customize_v2/base/load",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeListWithIdName = (params) => {
    return service({
        url: "/customize_v2/base/list_with_id_name",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const customizeCreate = (data) => {
    return service({
        url: "/customize_v2/base/create",
        method: 'post',
        data
    })
}

// @Summary 发货计划
export const customizeUpdate = (data) => {
    return service({
        url: "/customize_v2/base/update",
        method: 'post',
        data
    })
}

// @Summary 发货计划
export const customizeUpload = (data) => {
    return service({
        url: "/customize_v2/base/upload",
        method: 'post',
        data
    })
}