import service from '@/utils/request'

// @Summary 发货计划
export const itemAdviceList = (params) => {
    return service({
        url: "/temu/item_advice/list",
        method: 'get',
        params
    })
}