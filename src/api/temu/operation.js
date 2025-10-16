import service from '@/utils/request'

// @Summary 操作记录
export const temuOperationList = (params) => {
    return service({
        url: "/temu/operation/list",
        method: 'get',
        params
    })
}
