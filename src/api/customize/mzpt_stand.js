import service from '@/utils/request'

// @Summary 发货计划
export const mzptStandList = (params) => {
    return service({
        url: "/customize_v2/mzpt_stand/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptStandListByPage = (params) => {
    return service({
        url: "/customize_v2/mzpt_stand/list_by_page",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptStandLoad = (params) => {
    return service({
        url: "/customize_v2/mzpt_stand/load",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptStandUpdate = (data) => {
    return service({
        url: "/customize_v2/mzpt_stand/update",
        method: 'post',
        data
    })
}