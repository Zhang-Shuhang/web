import service from '@/utils/request'

export const profitVolumeAccount = (params) => {
    return service({
        url: "/profit/volume/account",
        method: 'get',
        params
    })
}

export const profitVolumeCategory = (params) => {
    return service({
        url: "/profit/volume/category",
        method: 'get',
        params
    })
}

export const profitVolumeFactory = (params) => {
    return service({
        url: "/profit/volume/factory",
        method: 'get',
        params
    })
}

export const profitVolumeTag = (params) => {
    return service({
        url: "/profit/volume/tag",
        method: 'get',
        params
    })
}
