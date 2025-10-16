import service from '@/utils/request'

// @Summary 发货计划
export const imageList = (params) => {
    return service({
        url: "/customize_v3/image/list",
        method: 'get',
        params
    })
}
// @Summary 发货计划
export const imageListByPage = (params) => {
    return service({
        url: "/customize_v3/image/list_by_page",
        method: 'get',
        params
    })
}