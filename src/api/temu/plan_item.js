import service from '@/utils/request'

// @Summary 发货计划
export const planItemList = (params) => {
    return service({
        url: "/temu/plan_item/list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const planGenCode = (data) => {
    return service({
        url: "/temu/plan_item/gen_code",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const planGenItemCode = (data) => {
    return service({
        url: "/temu/plan_item/gen_item_code",
        method: 'post',
        data
    })
}

// @Summary 作废
export const planZf = (data) => {
    return service({
        url: "/temu/plan_item/zf",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const planJoinDeliveryGoodsOrderPlatform = (data) => {
    return service({
        url: "/temu/plan_item/join_delivery_goods_order_platform",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const planJoinDeliveryGoodsOrderPlatformBySkuId = (data) => {
    return service({
        url: "/temu/plan_item/join_delivery_goods_order_platform_by_sku_id",
        method: 'post',
        data
    })
}

export const planBatchJoinDeliveryGoodsOrderPlatform = (data) => {
    return service({
        url: "/temu/plan_item/batch_join_delivery_goods_order_platform",
        method: 'post',
        data
    })
}

export const allBatchJoinDeliveryGoodsOrderPlatform = (data) => {
    return service({
        url: "/temu/plan_item/all_join_delivery_goods_order_platform",
        method: 'post',
        data
    })
}

// @Summary 查物流
export const planItemQueryExpressTraceInfo = (params) => {
    return service({
        url: "/temu/plan_item/query_express_trace_info",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const planItemSync = (data) => {
    return service({
        url: "/temu/plan_item/sync",
        method: 'post',
        data
    })
}

// @Summary 设置价格
export const planItemFix = (data) => {
    return service({
        url: "/temu/plan_item/fix",
        method: 'post',
        data: data
    })
}
