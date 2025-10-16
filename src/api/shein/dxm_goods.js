import service from '@/utils/request'


// @Summary 设置商品sku
export const setDxmGoodsSku = (data) => {
    return service({
        url: "/shein/dxm_goods/set_dxm_goods_sku",
        method: 'post',
        data: data
    })
}
