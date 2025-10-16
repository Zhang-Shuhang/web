import service from '@/utils/request'

// @Summary 发货计划
export const baseImageList = (params) => {
    return service({
        url: "/customize_v2/base_image/list",
        method: 'get',
        params
    })
}
// @Summary 发货计划
export const baseImageListByPage = (params) => {
    return service({
        url: "/customize_v2/base_image/list_by_page",
        method: 'get',
        params
    })
}