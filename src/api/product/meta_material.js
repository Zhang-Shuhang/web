import service from '@/utils/request'

export const metaMaterialListByPage = (params) => {
    return service({
        url: "/product_sys/meta_material/list_by_page",
        method: 'get',
        params
    })
}

export const metaMaterialList = (params) => {
    return service({
        url: "/product_sys/meta_material/list",
        method: 'get',
        params
    })
}

export const metaMaterialLoad = (params) => {
    return service({
        url: "/product_sys/meta_material/load",
        method: 'get',
        params
    })
}

export const metaMaterialCreate = (data) => {
    return service({
        url: "/product_sys/meta_material/create",
        method: 'post',
        data
    })
}

export const metaMaterialUpdate = (data) => {
    return service({
        url: "/product_sys/meta_material/update",
        method: 'post',
        data
    })
}
