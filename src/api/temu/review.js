import service from '@/utils/request'

// @Summary 生成编码文件
export const reviewList = (params) => {
    return service({
        url: "/temu/review/list",
        method: 'get',
        params
    })
}
