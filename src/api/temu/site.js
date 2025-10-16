import service from '@/utils/request'

// @Summary 生成编码文件
export const siteList = (params) => {
    return service({
        url: "/temu/site/list",
        method: 'get',
        params
    })
}
