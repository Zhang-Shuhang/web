import service from '@/utils/request'

// @Summary 发货计划
export const mzptElemList = (params) => {
    return service({
        url: "/customize_v2/mzpt_elem/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptElemListByPage = (params) => {
    return service({
        url: "/customize_v2/mzpt_elem/list_by_page",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptElemLoad = (params) => {
    return service({
        url: "/customize_v2/mzpt_elem/load",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptElemLoadList = (params) => {
    return service({
        url: "/customize_v2/mzpt_elem/load_list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptElemUpdate = (data) => {
    return service({
        url: "/customize_v2/mzpt_elem/update",
        method: 'post',
        data
    })
}