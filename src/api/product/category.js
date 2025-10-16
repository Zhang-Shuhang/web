import service from '@/utils/request'

export const categoryListByPage = (params) => {
    return service({
        url: "/product_sys/category/list_by_page",
        method: 'get',
        params
    })
}


export const categoryList = (params) => {
    return service({
        url: "/product_sys/category/list",
        method: 'get',
        params
    })
}

export const categoryLoad = (params) => {
    return service({
        url: "/product_sys/category/load",
        method: 'get',
        params
    })
}

export const categoryCreate = (data) => {
    return service({
        url: "/product_sys/category/create",
        method: 'post',
        data
    })
}

export const categoryUpdateBase = (data) => {
    return service({
        url: "/product_sys/category/update_base",
        method: 'post',
        data
    })
}

export const categoryUpdatePrice = (data) => {
    return service({
        url: "/product_sys/category/update_price",
        method: 'post',
        data
    })
}

export const categoryUpdateProperty = (data) => {
    return service({
        url: "/product_sys/category/update_property",
        method: 'post',
        data
    })
}

export const categoryUpdateConfirm = (data) => {
    return service({
        url: "/product_sys/category/update_confirm",
        method: 'post',
        data
    })
}
