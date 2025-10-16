import service from '@/utils/request'

export const shipmentUnitList = (params) => {
    return service({
        url: "/mkd/shipment_unit/list",
        method: 'get',
        params
    })
}