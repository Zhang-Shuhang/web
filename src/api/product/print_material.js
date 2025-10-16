import service from '@/utils/request'

export const printMaterialListByPage = (params) => {
    return service({
        url: "/product_sys/print_material/list_by_page",
        method: 'get',
        params
    })
}

export const printMaterialList = (params) => {
    return service({
        url: "/product_sys/print_material/list",
        method: 'get',
        params
    })
}

export const printMaterialLoad = (params) => {
    return service({
        url: "/product_sys/print_material/load",
        method: 'get',
        params
    })
}

export const printMaterialCreate = (data) => {
    return service({
        url: "/product_sys/print_material/create",
        method: 'post',
        data
    })
}

export const printMaterialUpdate = (data) => {
    return service({
        url: "/product_sys/print_material/update",
        method: 'post',
        data
    })
}
