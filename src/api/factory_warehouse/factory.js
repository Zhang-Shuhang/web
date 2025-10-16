import service from '@/utils/request'

export const factoryWarehouseFactoryList = (params) => {
    return service({
        url: "/factory_warehouse/factory/list",
        method: 'get',
        params
    })
}
