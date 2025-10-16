import service from '@/utils/request'

export const itemDxmRecordDailyList = (params) => {
    return service({
        url: "/temu/item_dxm_record/daily_list",
        method: 'get',
        params
    })
}

export const itemDxmRecordHourList = (params) => {
    return service({
        url: "/temu/item_dxm_record/hour_list",
        method: 'get',
        params
    })
}