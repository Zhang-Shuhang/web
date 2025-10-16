import service from '@/utils/request'

// @Summary 订单列表
export const semiOrderList = (data) => {
    return service({
        url: "/temu/semi_order/list",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderPackageTracking = (params) => {
    return service({
        url: "/temu/semi_order/package_tracking",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderCancelList = (params) => {
    return service({
        url: "/temu/semi_order/cancel_list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderCancel = (data) => {
    return service({
        url: "/temu/semi_order/cancel",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderChangeAddress = (data) => {
    return service({
        url: "/temu/semi_order/change_address",
        method: 'post',
        data
    })
}

// @Summary
export const semiOrderQueryUsShippingProvider = (params) => {
    return service({
        url: "/temu/semi_order/query_us_shipping_provider",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderSync = (data) => {
    return service({
        url: "/temu/semi_order/sync",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderAllocate = (data) => {
    return service({
        url: "/temu/semi_order/allocate",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderExport = (data) => {
    return service({
        url: "/temu/semi_order/export",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderAllocateList = (params) => {
    return service({
        url: "/temu/semi_order/allocate_list",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderSyncDxm = (data) => {
    return service({
        url: "/temu/semi_order/sync_dxm",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderSyncDxmForCombine = (data) => {
    return service({
        url: "/temu/semi_order/sync_dxm_for_combine",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderSyncAddress = (data) => {
    return service({
        url: "/temu/semi_order/sync_address",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderBatchSend = (data) => {
    return service({
        url: "/temu/semi_order/batch_send",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderUpdateShipMode = (data) => {
    return service({
        url: "/temu/semi_order/update_ship_mode",
        method: 'post',
        data
    })
}

// @Summary 订单列表
export const semiOrderShipModeException = (params) => {
    return service({
        url: "/temu/semi_order/ship_mode_exception",
        method: 'get',
        params
    })
}

// @Summary 订单列表
export const semiOrderChargeBackQueryList = (params) => {
    return service({
        url: "/temu/semi_order/charge_back_query_list",
        method: 'get',
        params
    })
}

export const semiOrderQuerySkuHistoryPackage = (data) => {
    return service({
        url: "/temu/semi_order/query_sku_history_package",
        method: 'post',
        data
    })
}

export const semiOrderQueryShippingProviderOptional = (data) => {
    return service({
        url: "/temu/semi_order/query_shipping_provider_optional",
        method: 'post',
        data
    })
}

export const semiOrderOnlineBatchSend = (data) => {
    return service({
        url: "/temu/semi_order/online_batch_send",
        method: 'post',
        data
    })
}

export const semiOrderShipPackageList = (data) => {
    return service({
        url: "/temu/semi_order/ship_package_list",
        method: 'post',
        data
    })
}

export const semiOrderSyncShipPackageList = (data) => {
    return service({
        url: "/temu/semi_order/sync_ship_package_list",
        method: 'post',
        data
    })
}

export const semiOrderExportWinit = (data) => {
    return service({
        url: "/temu/semi_order/export_winit",
        method: 'post',
        data
    })
}

export const semiOrderExportUb = (data) => {
    return service({
        url: "/temu/semi_order/export_ub",
        method: 'post',
        data
    })
}

export const semiOrderExportAll = (data) => {
    return service({
        url: "/temu/semi_order/export_all",
        method: 'post',
        data
    })
}

export const semiOrderExportY2OrderAccounts = (data) => {
    return service({
        url: "/temu/semi_order/export_y2_order_accounts",
        method: 'post',
        data
    })
}

export const semiOrderSubmitAppealInfo = (data) => {
    return service({
        url: "/temu/semi_order/submit_appeal_info",
        method: 'post',
        data
    })
}

export const semiOrderTrackList = (data) => {
    return service({
        url: "/temu/semi_order/track_list",
        method: 'post',
        data
    })
}

export const semiOrderCreateY2Task = (data) => {
    return service({
        url: "/temu/semi_order/create_y2_task",
        method: 'post',
        data
    })
}

export const semiOrderNotifyY2Task = (data) => {
    return service({
        url: "/temu/semi_order/notify_y2_task",
        method: 'post',
        data
    })
}

export const semiOrderLackStockApply = (data) => {
    return service({
        url: "/temu/semi_order/lack_stock_apply",
        method: 'post',
        data
    })
}

export const semiOrderShipCompanyList = (params) => {
    return service({
        url: "/temu/semi_order/ship_company_list",
        method: 'get',
        params
    })
}

export const semiOrderY2Allocate = (data) => {
    return service({
        url: "/temu/semi_order/y2_allocate",
        method: 'post',
        data
    })
}