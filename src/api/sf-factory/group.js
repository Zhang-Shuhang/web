import service from '@/utils/request'

export const groupList = (params) => {
    return service({
        url: "/sf-factory/group/list",
        method: 'get',
        params
    })
}

export const groupSet = (data) => {
    return service({
        url: "/sf-factory/group/set",
        method: 'post',
        data
    })
}