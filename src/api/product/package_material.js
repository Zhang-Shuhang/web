import service from '@/utils/request'

export const packageMaterialListByPage = (params) => {
    return service({
        url: "/product_sys/package_material/list_by_page",
        method: 'get',
        params
    })
}

export const packageMaterialList = (params) => {
    return service({
        url: "/product_sys/package_material/list",
        method: 'get',
        params
    })
}

export const packageMaterialLoad = (params) => {
    return service({
        url: "/product_sys/package_material/load",
        method: 'get',
        params
    })
}

export const packageMaterialCreate = (data) => {
    return service({
        url: "/product_sys/package_material/create",
        method: 'post',
        data
    })
}

export const packageMaterialUpdate = (data) => {
    return service({
        url: "/product_sys/package_material/update",
        method: 'post',
        data
    })
}
