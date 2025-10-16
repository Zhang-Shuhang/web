import service from '@/utils/request'

export const messageList = (params) => {
    return service({
        url: "/temu/message/list",
        method: 'get',
        params
    })
}

export const messageConfirm = (data) => {
    return service({
        url: "/temu/message/confirm",
        method: 'post',
        data
    })
}

export const messageCount = () => {
    return service({
        url: "/temu/message/count",
        method: 'get',
        unloading: true,
    })
}
