import service from '@/utils/request'

export const couponList = (params) => {
    return service({
        url: "/temu/coupon/list",
        method: 'get',
        params
    })
}

export const couponSync = (data) => {
    return service({
        url: "/temu/coupon/sync",
        method: 'post',
        data
    })
}

export const couponDelay = (data) => {
    return service({
        url: "/temu/coupon/delay",
        method: 'post',
        data
    })
}

export const couponIncrease = (data) => {
    return service({
        url: "/temu/coupon/increase",
        method: 'post',
        data
    })
}

export const couponOffline = (data) => {
    return service({
        url: "/temu/coupon/offline",
        method: 'post',
        data
    })
}

export const couponCreate = (data) => {
    return service({
        url: "/temu/coupon/create",
        method: 'post',
        data
    })
}