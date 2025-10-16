import service from '@/utils/request'

export const factoryDownloadByUrl = (params) => {
    return service({
        url: "/sf-factory-v2/download/by_url",
        method: 'get',
        params
    })
}