import service from '@/utils/request'

// @Summary 发货计划
export const deliveryOrderList = (data) => {
    return service({
        url: "/temu/delivery_order/list",
        method: 'post',
        data
    })
}

// @Summary 发货计划
export const deliveryOrderWarehouseList = (data) => {
    return service({
        url: "/temu/delivery_order/warehouse_list",
        method: 'post',
        data
    })
}

// @Summary 发货计划
export const deliveryOrderPackageDetail = (params) => {
    return service({
        url: "/temu/delivery_order/package_detail",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const deliveryOrderJoin = (data) => {
    return service({
        url: "/temu/delivery_order/join",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderSetSelfDelivery = (data) => {
    return service({
        url: "/temu/delivery_order/set_self_delivery",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderPrintSelfDelivery = (data) => {
    return service({
        url: "/temu/delivery_order/print_self_delivery",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderBack = (data) => {
    return service({
        url: "/temu/delivery_order/back",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderCancel = (data) => {
    return service({
        url: "/temu/delivery_order/cancel",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderConfirm = (data) => {
    return service({
        url: "/temu/delivery_order/confirm",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderSavePackage = (data) => {
    return service({
        url: "/temu/delivery_order/save_package",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderPrint = (data) => {
    return service({
        url: "/temu/delivery_order/print",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderAllocateInventoryOut = (data) => {
    return service({
        url: "/temu/delivery_order/allocate_inventory_out",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderAllocateInventorySelf = (data) => {
    return service({
        url: "/temu/delivery_order/allocate_inventory_self",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderAllocateInventoryFactory = (data) => {
    return service({
        url: "/temu/delivery_order/allocate_inventory_factory",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderSync = (params) => {
    return service({
        url: "/temu/delivery_order/sync",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const deliveryOrderQuerySupplierAddressInfo = (params) => {
    return service({
        url: "/temu/delivery_order/query_supplier_address_info",
        method: 'get',
        params
    })
}


// @Summary 生成编码文件
export const deliveryOrderQueryRecommendExpressCompany = (params) => {
    return service({
        url: "/temu/delivery_order/query_recommend_express_company",
        method: 'get',
        params
    })
}


// @Summary 生成编码文件
export const deliveryOrderBind = (data) => {
    return service({
        url: "/temu/delivery_order/bind",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderBindRecordList = (params) => {
    return service({
        url: "/temu/delivery_order/bind_record_list",
        method: 'get',
        params
    })
}


// @Summary 生成编码文件
export const deliveryOrderUpdateBindRecordCount = (data) => {
    return service({
        url: "/temu/delivery_order/update_bind_record_count",
        method: 'post',
        data
    })
}


// @Summary 生成编码文件
export const deliveryOrderSyncFactory = (data) => {
    return service({
        url: "/temu/delivery_order/sync_factory",
        method: 'post',
        data
    })
}


// @Summary 生成编码文件
export const deliveryOrderCustomizePb = (data) => {
    return service({
        url: "/temu/delivery_order/customize_pb",
        method: 'post',
        data
    })
}


// @Summary 生成编码文件
export const deliveryOrderAttachToLogistic = (data) => {
    return service({
        url: "/temu/delivery_order/attach_to_logistic",
        method: 'post',
        data
    })
}


// @Summary 生成编码文件
export const deliveryOrderAddToFhdlb = (data) => {
    return service({
        url: "/temu/delivery_order/add_to_fhdlb",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderSyncForJitAndCustomize = (data) => {
    return service({
        url: "/temu/delivery_order/sync_for_jit_and_customize",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderExportWarehouseAddr = (data) => {
    return service({
        url: "/temu/delivery_order/export_warehouse_addr",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderSetAutoLogistic = (data) => {
    return service({
        url: "/temu/delivery_order/set_auto_logistic",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const deliveryOrderNotifyJit = (data) => {
    return service({
        url: "/temu/delivery_order/notify_jit",
        method: 'post',
        data
    })
}
