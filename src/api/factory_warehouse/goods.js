import service from '@/utils/request'

export const factoryWarehouseGoodsList = (params) => {
    return service({
        url: "/factory_warehouse/goods/list",
        method: 'get',
        params
    })
}

export const factoryWarehouseGoodsListByPage = (params) => {
    return service({
        url: "/factory_warehouse/goods/list_by_page",
        method: 'get',
        params
    })
}

export const factoryWarehouseGoodsCreate = (data) => {
    return service({
        url: "/factory_warehouse/goods/create",
        method: 'post',
        data
    })
}

export const factoryWarehouseGoodsUpdate = (data) => {
    return service({
        url: "/factory_warehouse/goods/update",
        method: 'post',
        data
    })
}
