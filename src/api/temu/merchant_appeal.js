import service from '@/utils/request'

// @Summary 发货计划
export const merchantAppealList = (params) => {
    return service({
        url: "/temu/merchant_appeal/list",
        method: 'get',
        params
    })
}

export const merchantAppealSubmit = (data) => {
    return service({
        url: "/temu/merchant_appeal/submit",
        method: 'post',
        data
    })
}