import service from '@/utils/request'

export const adReportList = (params) => {
    return service({
        url: "/temu/ad/report_list",
        method: 'get',
        params
    })
}

export const adReportDaily = (params) => {
    return service({
        url: "/temu/ad/report_daily",
        method: 'get',
        params
    })
}

export const adReportHour = (params) => {
    return service({
        url: "/temu/ad/report_hour",
        method: 'get',
        params
    })
}

export const adProductList = (params) => {
    return service({
        url: "/temu/ad/product_list",
        method: 'get',
        params
    })
}

export const adProductDaily = (params) => {
    return service({
        url: "/temu/ad/product_daily",
        method: 'get',
        params
    })
}

export const adProductHour = (params) => {
    return service({
        url: "/temu/ad/product_hour",
        method: 'get',
        params
    })
}

export const adStop = (data) => {
    return service({
        url: "/temu/ad/stop",
        method: 'post',
        data
    })
}

export const adStart = (data) => {
    return service({
        url: "/temu/ad/start",
        method: 'post',
        data
    })
}

export const adModify = (data) => {
    return service({
        url: "/temu/ad/modify",
        method: 'post',
        data
    })
}

export const adGetBid = (data) => {
    return service({
        url: "/temu/ad/get_bid",
        method: 'post',
        data
    })
}