import service from '@/utils/request'

export const paymentInfo = (params) => {
    return service({
        url: "/temu/payment/info",
        method: 'get',
        params
    })
}

export const paymentUserList = (params) => {
    return service({
        url: "/temu/payment/user_list",
        method: 'get',
        params
    })
}

export const paymentCashRecordList = (params) => {
    return service({
        url: "/temu/payment/cash_record_list",
        method: 'get',
        params
    })
}

export const paymentSend = (data) => {
    return service({
        url: "/temu/payment/send",
        method: 'post',
        data
    })
}

export const paymentApply = (data) => {
    return service({
        url: "/temu/payment/apply",
        method: 'post',
        data
    })
}