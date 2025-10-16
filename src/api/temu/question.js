import service from '@/utils/request'

// @Summary 生成编码文件
export const questionList = (params) => {
    return service({
        url: "/temu/question/list",
        method: 'get',
        params
    })
}

// @Summary 生成编码文件
export const questionSync = () => {
    return service({
        url: "/temu/question/sync",
        method: 'post',
    })
}

// @Summary 生成编码文件
export const questionReply = (data) => {
    return service({
        url: "/temu/question/reply",
        method: 'post',
        data
    })
}
