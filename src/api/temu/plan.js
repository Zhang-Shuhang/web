import service from '@/utils/request'

// @Summary 生成编码文件
export const planCountDown = (data) => {
    return service({
        url: "/temu/plan/count_down",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const getPlanPreSaleList = (params) => {
    return service({
        url: "/temu/plan/pre_sale",
        method: 'get',
        params
    })
}


// @Summary 生成编码文件
export const getPlanQcResult = (params) => {
    return service({
        url: "/temu/plan/qc_result",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const setPlanPreSaleList = (data) => {
    return service({
        url: "/temu/plan/pre_sale",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const genPlan = (params) => {
    return service({
        url: "/temu/plan/get",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const genPlanScript = (data) => {
    return service({
        url: "/temu/plan/gen_script",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const planConfirm = (data) => {
    return service({
        url: "/temu/plan/confirm",
        method: 'post',
        data
    })
}
