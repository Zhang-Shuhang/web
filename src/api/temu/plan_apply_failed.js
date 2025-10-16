import service from '@/utils/request'

// @Summary 发货计划
export const planApplyFailedList = (params) => {
    return service({
        url: "/temu/plan_apply_failed/list",
        method: 'get',
        params
    })
}