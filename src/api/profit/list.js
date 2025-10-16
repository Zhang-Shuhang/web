import service from '@/utils/request'

export const profitListAccount = (params) => {
    return service({
        url: "/profit/list/account",
        method: 'get',
        params
    })
}

export const profitListProduct = (params) => {
    return service({
        url: "/profit/list/product",
        method: 'get',
        params
    })
}

export const profitListCategory = (params) => {
    return service({
        url: "/profit/list/category",
        method: 'get',
        params
    })
}

export const profitListFactory = (params) => {
    return service({
        url: "/profit/list/factory",
        method: 'get',
        params
    })
}

export const profitListTag = (params) => {
    return service({
        url: "/profit/list/tag",
        method: 'get',
        params
    })
}

export const profitListVariation = (params) => {
    return service({
        url: "/profit/list/variation",
        method: 'get',
        params
    })
}