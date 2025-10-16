import service from '@/utils/request'

// @Summary 发货台同步
export const sync = (params) => {
    return service({
        url: "/temu/sync",
        method: 'get',
        params
    })
}
