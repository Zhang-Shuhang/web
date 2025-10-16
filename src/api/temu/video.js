import service from '@/utils/request'

export const videoList = (params) => {
    return service({
        url: "/temu/video/list",
        method: 'get',
        params
    })
}

export const videoSync = (params) => {
    return service({
        url: "/temu/video/sync",
        method: 'post',
        params
    })
}