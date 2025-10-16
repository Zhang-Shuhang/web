import service from '@/utils/request'

// @Summary 发货计划
export const fontList = (params) => {
    return service({
        url: "/customize_v2/font/list",
        method: 'get',
        params
    })
}
// @Summary 发货计划
export const fontListByPage = (params) => {
    return service({
        url: "/customize_v2/font/list_by_page",
        method: 'get',
        params
    })
}