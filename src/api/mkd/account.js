import service from '@/utils/request'

export const accountList = (params) => {
    return service({
        url: "/mkd/account/list",
        method: 'get',
        params
    })
}

export const accountGenAuthUrl = (params) => {
    return service({
        url: "/mkd/account/gen_auth_url",
        method: 'get',
        params
    })
}
