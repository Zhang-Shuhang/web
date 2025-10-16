import service from '@/utils/request'

// @Summary 店小秘同步
export const dxmSync = (params) => {
    return service({
        url: "/dxm/sync",
        method: 'get',
        params
    })
}