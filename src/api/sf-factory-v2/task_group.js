import service from '@/utils/request'

export const factoryTaskGroupList = (params) => {
    return service({
        url: "/sf-factory-v2/task_group/list",
        method: 'get',
        params
    })
}

export const factoryTaskGroupConfirm = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/confirm",
        method: 'post',
        data
    })
}

export const factoryTaskGroupSyncToCustomize = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/sync_to_customize",
        method: 'post',
        data
    })
}

export const factoryTaskGroupPrint = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/print",
        method: 'post',
        data
    })
}

export const factoryTaskGroupBack = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/back",
        method: 'post',
        data
    })
}

export const factoryTaskGroupPrintGroup = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/print_group",
        method: 'post',
        data
    })
}

export const factoryTaskGroupPrintJit = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/print_jit",
        method: 'post',
        data
    })
}

export const factoryTaskGroupCompleteJit = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/complete_jit",
        method: 'post',
        data
    })
}

export const factoryTaskGroupPrintBarcodes = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/print_barcodes",
        method: 'post',
        data
    })
}


export const factoryTaskGroupPrintXms = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/print_xms",
        method: 'post',
        data
    })
}

export const factoryTaskGroupPrintProduce = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/print_produce",
        method: 'post',
        data
    })
}

export const factoryTaskGroupPrepare = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/prepare",
        method: 'post',
        data
    })
}

export const factoryTaskGroupDelete = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/delete",
        method: 'post',
        data
    })
}

export const factoryTaskGroupUploadTkBarcodeUrl = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/upload_tk_barcode_url",
        method: 'post',
        data
    })
}

export const factoryTaskGroupUploadTemuBarcodeUrl = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/upload_temu_barcode_url",
        method: 'post',
        data
    })
}

export const factoryTaskGroupChangeUrgentStatus = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/change_urgent_status",
        method: 'post',
        data
    })
}

export const factoryTaskChangMustSend = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/change_must_send",
        method: 'post',
        data
    })
}

export const factoryTaskGroupCalcStatistics = (params) => {
    return service({
        url: "/sf-factory-v2/task_group/calc_statistics",
        method: 'get',
        params
    })
}


export const factoryTaskGroupCategoryList = (params) => {
    return service({
        url: "/sf-factory-v2/task_group/category_list",
        method: 'get',
        params
    })
}

export const factoryTaskGroupWarehouseList = (params) => {
    return service({
        url: "/sf-factory-v2/task_group/warehouse_list",
        method: 'get',
        params
    })
}

export const factoryTaskGroupSetCategory = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/set_category",
        method: 'post',
        data
    })
}

export const factoryTaskGroupHide = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/hide",
        method: 'post',
        data
    })
}

export const factoryTaskGroupJit = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/jit",
        method: 'post',
        data
    })
}

export const factoryTaskGroupQueryCapacity = (params) => {
    return service({
        url: "/sf-factory-v2/task_group/capacity",
        method: 'get',
        params
    })
}

export const factoryTaskGroupProduceRecords = (params) => {
    return service({
        url: "/sf-factory-v2/task_group/produce_records",
        method: 'get',
        params
    })
}

export const factoryTaskGroupCreateJingDong = (data) => {
    return service({
        url: "/sf-factory-v2/task_group/create_jing_dong",
        method: 'post',
        data
    })
}