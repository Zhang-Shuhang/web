import service from '@/utils/request'

// @Summary 生成编码文件
export const labelCodeRuleList = (params) => {
    return service({
        url: "/temu/label_code_rule/list",
        method: 'get',
        params
    })
}


// @Summary 生成编码文件
export const labelCodeRuleAdd = (data) => {
    return service({
        url: "/temu/label_code_rule/add",
        method: 'post',
        data
    })
}

// @Summary 生成编码文件
export const labelCodeRuleRemove = (data) => {
    return service({
        url: "/temu/label_code_rule/remove",
        method: 'post',
        data
    })
}
