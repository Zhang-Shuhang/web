import service from '@/utils/request'

export const productPriceComparingList = (params) => {
    return service({
        url: "/temu/product_price_comparing/list",
        method: 'get',
        params
    })
}

export const productPriceComparingDetail = (params) => {
    return service({
        url: "/temu/product_price_comparing/detail",
        method: 'get',
        params
    })
}

export const productPriceComparingConfirm = (data) => {
    return service({
        url: "/temu/product_price_comparing/confirm",
        method: 'post',
        data
    })
}

export const productPriceComparingSync = (data) => {
    return service({
        url: "/temu/product_price_comparing/sync",
        method: 'post',
        data
    })
}