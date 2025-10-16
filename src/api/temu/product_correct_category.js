import service from '@/utils/request'

// @Summary 产品列表
export const productCorrectCategoryList = (params) => {
    return service({
        url: "/temu/product_correct_category/list",
        method: 'get',
        params
    })
}

// @Summary 产品同步
export const productCorrectCategorySync = (data) => {
    return service({
        url: "/temu/product_correct_category/sync",
        method: 'post',
        data
    })
}

// @Summary 产品同步
export const productCorrectCategoryCorrect = (data) => {
    return service({
        url: "/temu/product_correct_category/correct",
        method: 'post',
        data
    })
}