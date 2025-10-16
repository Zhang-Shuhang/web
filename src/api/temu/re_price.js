import service from '@/utils/request'

// @Summary 发货台同步
export const rePriceList = (params) => {
    return service({
        url: "/temu/re_price/list",
        method: 'get',
        params
    })
}

// @Summary 发货台同步
export const rePriceClick = (data) => {
    return service({
        url: "/temu/re_price/click",
        method: 'post',
        data
    })
}
