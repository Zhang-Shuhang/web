import service from '@/utils/request'

// @Tags systrm
// @Summary 获取配置文件内容
// @Security ApiKeyAuth
// @Produce  application/json
// @Success 200 {string} string "{"success":true,"data":{},"msg":"返回成功"}"
// @Router /system/getSystemConfig [post]
export const getSystemConfig = () => {
    return service({
        url: "/core/system/getSystemConfig",
        method: 'post',
    })
}

// @Tags system
// @Summary 设置配置文件内容
// @Security ApiKeyAuth
// @Produce  application/json
// @Param data body sysModel.System true
// @Success 200 {string} string "{"success":true,"data":{},"msg":"返回成功"}"
// @Router /system/setSystemConfig [post]
export const setSystemConfig = (data) => {
    return service({
        url: "/core/system/setSystemConfig",
        method: 'post',
        data
    })
}

// @Tags system
// @Summary 设置配置文件内容
// @Security ApiKeyAuth
// @Produce  application/json
// @Param data body sysModel.System true
// @Success 200 {string} string "{"success":true,"data":{},"msg":"返回成功"}"
// @Router /system/setSystemConfig [post]
export const getSystemWebV2Url = () => {
    return service({
        url: "/core/system/webV2Url",
        method: 'get',
    })
}