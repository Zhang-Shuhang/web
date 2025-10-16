import service from '@/utils/request'

// @Summary 发货计划
export const suggestList = (params) => {
    return service({
        url: "/shein/suggest/list",
        method: 'get',
        params
    })
}

// @Summary 设置首单
export const suggestApply = (data) => {
    return service({
        url: "/shein/suggest/apply",
        method: 'post',
        data: data
    })
}
