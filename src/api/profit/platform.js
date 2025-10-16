import service from '@/utils/request'

export const platformList = (params) => {
    return service({
        url: "/profit/platform/list",
        method: 'get',
        params
    })
}