import service from '@/utils/request'

export const accountList = (params) => {
    return service({
        url: "/profit/account/list",
        method: 'get',
        params
    })
}