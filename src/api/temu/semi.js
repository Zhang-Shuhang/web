import service from '@/utils/request'

// @Summary 订单列表
export const semiWarehouseList = (params) => {
    return service({
        url: "/temu/semi/warehouse_list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiFreightTemplateList = (params) => {
    return service({
        url: "/temu/semi/freight_template_list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiAddPlatformStock = (data) => {
    return service({
        url: "/temu/semi/add_platform_stock",
        method: 'post',
        data,
    })
}

// @Summary 订单列表
export const semiAddEnablePreSale = (data) => {
    return service({
        url: "/temu/semi/enable_pre_sale",
        method: 'post',
        data,
    })
}

// @Summary 订单列表
export const semiPlatformStock = (params) => {
    return service({
        url: "/temu/semi/platform_stock",
        method: 'get',
        params
    })
}

// @Summary 半托管产品列表
export const semiList = (params) => {
    return service({
        url: "/temu/semi/list",
        method: 'get',
        params
    })
}

// @Summary 半托管产品列表
export const semiGetY2AutoTransportSettingExist = (params) => {
    return service({
        url: "/temu/semi/y2_auto_transport_setting_exist",
        method: 'get',
        params
    })
}

// @Summary 半托管产品列表
export const semiGetY2AutoTransportSetting = (params) => {
    return service({
        url: "/temu/semi/y2_auto_transport_setting",
        method: 'get',
        params
    })
}

// @Summary 半托管产品列表
export const semiUpdateY2AutoTransportSetting = (data) => {
    return service({
        url: "/temu/semi/update_y2_auto_transport_setting",
        method: 'post',
        data
    })
}

// @Summary 半托管产品列表
export const semiDeleteY2AutoTransportSetting = (data) => {
    return service({
        url: "/temu/semi/delete_y2_auto_transport_setting",
        method: 'post',
        data
    })
}
