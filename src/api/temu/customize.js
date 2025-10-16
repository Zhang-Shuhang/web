import service from '@/utils/request'

export const customizeListByPage = (params) => {
    return service({
        url: "/temu/customize_rule/list_by_page",
        method: 'get',
        params
    })
}

export const customizeEdit = (data) => {
    return service({
        url: "/temu/customize_rule/edit",
        method: 'post',
        data
    })
}

export const transparentAreas = (data) => {
    return service({
        url: "/temu/customize_rule/transparent_areas",
        method: 'post',
        data
    })
}