import service from '@/utils/request'

// @Summary 发货计划
export const saleItemList = (params) => {
    return service({
        url: "/temu/sale_item/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const saleItemDxmGoodsStatisticList = (params) => {
    return service({
        url: "/temu/sale_item/dxm_goods_statistic_list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const saleItemDxmGoodsProcess = (data) => {
    return service({
        url: "/temu/sale_item/dxm_goods_process",
        method: 'post',
        data
    })
}

// @Summary 每日列表
export const saleItemDailyList = (params) => {
    return service({
        url: "/temu/sale_item/daily_list",
        method: 'get',
        params
    })
}

// @Summary 每日列表
export const saleItemDailyListByIds = (params) => {
    return service({
        url: "/temu/sale_item/daily_list_by_ids",
        method: 'get',
        params
    })
}

// @Summary 每日列表
export const saleItemMultiDailyList = (params) => {
    return service({
        url: "/temu/sale_item/multi_daily_list",
        method: 'get',
        params
    })
}

// @Summary 设置价格
export const saleItemSetPrice = (data) => {
    return service({
        url: "/temu/sale_item/set_price",
        method: 'post',
        data: data
    })
}

// @Summary 设置商品sku
export const saleItemSetDxmGoodsSku = (data) => {
    return service({
        url: "/temu/sale_item/set_dxm_goods_sku",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const saleItemFirstOrder = (data) => {
    return service({
        url: "/temu/sale_item/first_order",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const saleItemLevelReset = (data) => {
    return service({
        url: "/temu/sale_item/level_reset",
        method: 'post',
        data: data
    })
}

// @Summary 设置首单
export const saleItemAddBuyRecord = (data) => {
    return service({
        url: "/temu/sale_item/add_buy_record",
        method: 'post',
        data: data
    })
}

// @Summary 锁掉
export const saleItemBan = (data) => {
    return service({
        url: "/temu/sale_item/ban",
        method: 'post',
        data: data
    })
}

// @Summary 锁掉
export const saleItemBanProduce = (data) => {
    return service({
        url: "/temu/sale_item/ban_produce",
        method: 'post',
        data: data
    })
}

// @Summary 锁掉
export const saleItemDxmInventoryFix = (data) => {
    return service({
        url: "/temu/sale_item/dxm_inventory_fix",
        method: 'post',
        data: data
    })
}

// @Summary 锁掉
export const saleItemInfo = (params) => {
    return service({
        url: "/temu/sale_item/info",
        method: 'get',
        params
    })
}

// @Summary 锁掉
export const saleItemEditSku = (data) => {
    return service({
        url: "/temu/sale_item/edit_sku",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemCountDown = (data) => {
    return service({
        url: "/temu/sale_item/count_down",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemAddVirtualStock = (data) => {
    return service({
        url: "/temu/sale_item/add_stock",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemChangeMinStock = (data) => {
    return service({
        url: "/temu/sale_item/change_min_stock",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemChangeMinStocks = (data) => {
    return service({
        url: "/temu/sale_item/change_min_stocks",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemUpdatePrice = (data) => {
    return service({
        url: "/temu/sale_item/adjust_price",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemBatchModifySkuCode = (data) => {
    return service({
        url: "/temu/sale_item/batch_modify_sku_code",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const itemImageReview = (params) => {
    return service({
        url: "/temu/sale_item/image_review",
        method: 'get',
        params
    })
}


// @Summary 生成编码文件
export const itemSameSkuCode = (params) => {
    return service({
        url: "/temu/sale_item/same_sku_code",
        method: 'get',
        params
    })
}