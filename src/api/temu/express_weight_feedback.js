import service from '@/utils/request'

// @Summary 发货计划
export const expressWeightFeedbackList = (params) => {
    return service({
        url: "/temu/express_weight_feedback/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const expressWeightFeedbackExpressList = (params) => {
    return service({
        url: "/temu/express_weight_feedback/express_list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const expressWeightFeedbackDetail = (params) => {
    return service({
        url: "/temu/express_weight_feedback/detail",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const expressWeightFeedbackConfirm = (data) => {
    return service({
        url: "/temu/express_weight_feedback/confirm",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const expressWeightFeedbackReject = (data) => {
    return service({
        url: "/temu/express_weight_feedback/reject",
        method: 'post',
        data
    })
}


// @Summary 生成编码文件
export const expressWeightFeedbackSync = (data) => {
    return service({
        url: "/temu/express_weight_feedback/sync",
        method: 'post',
        data
    })
}
