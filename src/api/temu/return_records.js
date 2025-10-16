import service from '@/utils/request'

// @Summary 发货计划
export const returnRecordList = (params) => {
    return service({
        url: "/temu/return_records/list",
        method: 'get',
        params
    })
}

// @Summary 设置价格
export const returnRecordConfirm = (data) => {
    return service({
        url: "/temu/return_records/confirm",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordFix = (data) => {
    return service({
        url: "/temu/return_records/fix",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordAllocateId = (data) => {
    return service({
        url: "/temu/return_records/allocate_id",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordSetYycl = (data) => {
    return service({
        url: "/temu/return_records/set_yycl",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordSetCkcl = (data) => {
    return service({
        url: "/temu/return_records/set_ckcl",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordSetThrowAway = (data) => {
    return service({
        url: "/temu/return_records/set_throw_away",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordSetConfirm = (data) => {
    return service({
        url: "/temu/return_records/set_confirm",
        method: 'post',
        data: data
    })
}

// @Summary 设置价格
export const returnRecordSync = (data) => {
    return service({
        url: "/temu/return_records/sync",
        method: 'post',
        data: data
    })
}
