import service from '@/utils/request'

// @Summary 发货计划
export const customizeGroupList = (params) => {
    return service({
        url: "/customize_v3/group/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const groupListByPage = (params) => {
    return service({
        url: "/customize_v3/group/list_by_page",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const groupLoad = (params) => {
    return service({
        url: "/customize_v3/group/load",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const groupUpdate = (data) => {
    return service({
        url: "/customize_v3/group/update",
        method: 'post',
        data
    })
}