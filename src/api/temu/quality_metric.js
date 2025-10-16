import service from '@/utils/request'

export const qualityMetricList = (params) => {
    return service({
        url: "/temu/quality_metric/list",
        method: 'get',
        params
    })
}

export const qualityMetricProductList = (params) => {
    return service({
        url: "/temu/quality_metric/product_list",
        method: 'get',
        params
    })
}

export const qualityMetricProductTrend = (params) => {
    return service({
        url: "/temu/quality_metric/product_trend",
        method: 'get',
        params
    })
}
