import service from '@/utils/request'

export const diagramListByPage = (params) => {
    return service({
        url: "/product_sys/diagram/list_by_page",
        method: 'get',
        params
    })
}

export const diagramUpdatePrintMaterial = (data) => {
    return service({
        url: "/product_sys/diagram/update_print_material",
        method: 'post',
        data
    })
}
