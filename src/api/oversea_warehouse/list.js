import service from '@/utils/request'

export const overseasWarehouseList = (params) => {
    return service({
        url: "/temu/overseas_warehouse/list",
        method: 'get',
        params
    })
}

export const overseasWarehouseStockList = (params) => {
    return service({
        url: "/temu/overseas_warehouse/stock_list",
        method: 'get',
        params
    })
}

export const overseasWarehouseStock = (params) => {
    return service({
        url: "/temu/overseas_warehouse/stock",
        method: 'get',
        params
    })
}

export const overseasWarehouseStockCodeList = (params) => {
    return service({
        url: "/temu/overseas_warehouse/stock_code_list",
        method: 'get',
        params
    })
}

export const overseasWarehouseStockChangeRecordList = (params) => {
    return service({
        url: "/temu/overseas_warehouse/stock_change_record_list",
        method: 'get',
        params
    })
}

export const overseasWarehouseSyncStock = (params) => {
    return service({
        url: "/temu/overseas_warehouse/sync_stock",
        method: 'get',
        params
    })
}

export const overseasWarehouseExportStock = (data) => {
    return service({
        url: "/temu/overseas_warehouse/export_stock",
        method: 'post',
        data
    })
}

export const overseasWarehouseStockEstimated = (params) => {
    return service({
        url: "/temu/overseas_warehouse/stock_estimated",
        method: 'get',
        params
    })
}

export const overseasWarehouseUploadWinit = (data) => {
    return service({
        url: "/temu/overseas_warehouse/upload_winit",
        method: 'post',
        data
    })
}

export const overseasWarehouseUploadUb = (data) => {
    return service({
        url: "/temu/overseas_warehouse/upload_ub",
        method: 'post',
        data
    })
}

export const overseasWarehouseUploadJieBao = (data) => {
    return service({
        url: "/temu/overseas_warehouse/upload_jie_bao",
        method: 'post',
        data
    })
}

export const overseasWarehouseReview = (data) => {
    return service({
        url: "/temu/overseas_warehouse/review",
        method: 'post',
        data
    })
}

export const overseasWarehouseUploadCky = (data) => {
    return service({
        url: "/temu/overseas_warehouse/upload_cky",
        method: 'post',
        data
    })
}


export const overseasWarehouseUploadCkyCode = (data) => {
    return service({
        url: "/temu/overseas_warehouse/upload_cky_code",
        method: 'post',
        data
    })
}

export const overseasWarehouseUpdate = (data) => {
    return service({
        url: "/temu/overseas_warehouse/update",
        method: 'post',
        data
    })
}

export const overseasWarehouseSetEstimatedTime = (data) => {
    return service({
        url: "/temu/overseas_warehouse/set_estimated_time",
        method: 'post',
        data
    })
}

export const overseasWarehouseSetNote = (data) => {
    return service({
        url: "/temu/overseas_warehouse/set_note",
        method: 'post',
        data
    })
}

export const overseasWarehouseSetShip = (data) => {
    return service({
        url: "/temu/overseas_warehouse/set_ship",
        method: 'post',
        data
    })
}

export const overseasWarehouseSyncFactory = (data) => {
    return service({
        url: "/temu/overseas_warehouse/sync_factory",
        method: 'post',
        data
    })
}

export const overseasWarehouseCreatePlan = (data) => {
    return service({
        url: "/temu/overseas_warehouse/create_plan",
        method: 'post',
        data
    })
}


export const overseasWarehouseDelete = (data) => {
    return service({
        url: "/temu/overseas_warehouse/delete",
        method: 'post',
        data
    })
}

export const overseasWarehouseFixStock = (data) => {
    return service({
        url: "/temu/overseas_warehouse/fix_stock",
        method: 'post',
        data
    })
}

export const overseasWarehouseSetStockImage = (data) => {
    return service({
        url: "/temu/overseas_warehouse/set_stock_image",
        method: 'post',
        data
    })
}

export const overseasWarehouseBeiHuoList = (params) => {
    return service({
        url: "/temu/overseas_warehouse/bei_huo_list",
        method: 'get',
        params
    })
}

export const overseasWarehouseDeleteBeiHuo = (data) => {
    return service({
        url: "/temu/overseas_warehouse/delete_bei_huo",
        method: 'post',
        data
    })
}

export const overseasWarehouseAddBeiHuo = (data) => {
    return service({
        url: "/temu/overseas_warehouse/add_bei_huo",
        method: 'post',
        data
    })
}

export const overseasWarehouseConfirmBeiHuo = (data) => {
    return service({
        url: "/temu/overseas_warehouse/confirm_bei_huo",
        method: 'post',
        data
    })
}

export const overseasWarehouseExportBeiHuo = (data) => {
    return service({
        url: "/temu/overseas_warehouse/export_bei_huo",
        method: 'post',
        data
    })
}

export const overseasWarehouseNoLimitStart = (data) => {
    return service({
        url: "/temu/overseas_warehouse/no_limit_start",
        method: 'post',
        data
    })
}

export const overseasWarehouseNoLimitEnd = (data) => {
    return service({
        url: "/temu/overseas_warehouse/no_limit_end",
        method: 'post',
        data
    })
}

export const overseasWarehouseBan = (data) => {
    return service({
        url: "/temu/overseas_warehouse/ban",
        method: 'post',
        data
    })
}

export const overseasWarehouseClear = (data) => {
    return service({
        url: "/temu/overseas_warehouse/clear",
        method: 'post',
        data
    })
}
