import service from '@/utils/request'

export const profitStatisticsListAccount = (params) => {
    return service({
        url: "/profit/statistics/account",
        method: 'get',
        params
    })
}

export const profitStatisticsListProduct = (params) => {
    return service({
        url: "/profit/statistics/product",
        method: 'get',
        params
    })
}

export const profitStatisticsListSku = (params) => {
    return service({
        url: "/profit/statistics/sku",
        method: 'get',
        params
    })
}

export const profitStatisticsListSkuTotal = (params) => {
    return service({
        url: "/profit/statistics/sku_total",
        method: 'get',
        params
    })
}

export const profitStatisticsListCategory = (params) => {
    return service({
        url: "/profit/statistics/category",
        method: 'get',
        params
    })
}

export const profitStatisticsListFactory = (params) => {
    return service({
        url: "/profit/statistics/factory",
        method: 'get',
        params
    })
}

export const profitStatisticsListTag = (params) => {
    return service({
        url: "/profit/statistics/tag",
        method: 'get',
        params
    })
}

export const profitStatisticsListVariation = (params) => {
    return service({
        url: "/profit/statistics/variation",
        method: 'get',
        params
    })
}

export const profitStatisticsListExportAccount = (params) => {
    return service({
        url: "/profit/statistics/export_account",
        method: 'get',
        params
    })
}