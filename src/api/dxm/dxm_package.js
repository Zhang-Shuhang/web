import service from '@/utils/request'

// @Summary 发货计划
export const dxmPackageList = (data) => {
    return service({
        url: "/dxm/dxm_package/list",
        method: 'post',
        data
    })
}

// @Summary 发货计划
export const dxmPackagePrint = (data) => {
    return service({
        url: "/dxm/dxm_package/print",
        method: 'post',
        data
    })
}