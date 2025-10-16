import service from '@/utils/request'

// @Summary 生成编码文件
export const followFeedbackList = (params) => {
    return service({
        url: "/temu/follow_feedback/list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const followFeedbackSimilarProductList = (params) => {
    return service({
        url: "/temu/follow_feedback/similar_product_list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const followFeedbackSync = (data) => {
    return service({
        url: "/temu/follow_feedback/sync",
        method: 'post',
        data
    })
}


// @Summary 生成编码文件
export const followFeedbackSimilar = (data) => {
    return service({
        url: "/temu/follow_feedback/similar",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const followFeedbackAgain = (data) => {
    return service({
        url: "/temu/follow_feedback/again",
        method: 'post',
        data
    })
}
