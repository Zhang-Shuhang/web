import service from '@/utils/request'

export const activityList = (params) => {
    return service({
        url: "/temu/activity/list",
        method: 'get',
        params
    })
}

export const activityProductList = (params) => {
    return service({
        url: "/temu/activity/product_list",
        method: 'get',
        params
    })
}

export const activityProduct = (params) => {
    return service({
        url: "/temu/activity/product",
        method: 'get',
        params
    })
}

export const activityAppliedProductList = (params) => {
    return service({
        url: "/temu/activity/applied_product_list",
        method: 'get',
        params
    })
}

export const activityApplyRecordList = (params) => {
    return service({
        url: "/temu/activity/apply_record_list",
        method: 'get',
        params
    })
}

export const activityApply = (data) => {
    return service({
        url: "/temu/activity/apply",
        method: 'post',
        data
    })
}

export const activityReApply = (data) => {
    return service({
        url: "/temu/activity/re_apply",
        method: 'post',
        data
    })
}

export const activitySync = (data) => {
    return service({
        url: "/temu/activity/sync",
        method: 'post',
        data
    })
}

export const activityAddStock = (data) => {
    return service({
        url: "/temu/activity/add_stock",
        method: 'post',
        data
    })
}
export const activityLeave = (data) => {
    return service({
        url: "/temu/activity/leave",
        method: 'post',
        data
    })
}