import service from '@/utils/request'

export const produceSortList = (params) => {
    return service({
        url: "/sf-factory-v2/statistic/produce_sort_list",
        method: 'get',
        params
    })
}

export const produceSortComplete = (data) => {
    return service({
        url: "/sf-factory-v2/statistic/produce_sort_complete",
        method: 'post',
        data
    })
}