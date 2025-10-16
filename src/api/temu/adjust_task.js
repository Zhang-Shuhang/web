import service from '@/utils/request'

export const adjustTaskList = (params) => {
    return service({
        url: "/temu/adjust_task/list",
        method: 'get',
        params
    })
}

export const adjustTaskSync = (data) => {
    return service({
        url: "/temu/adjust_task/sync",
        method: 'post',
        data
    })
}

export const adjustTaskCategories = () => {
    return service({
        url: "/temu/adjust_task/categories",
        method: 'get',
    })
}

export const adjustTaskProperties = () => {
    return service({
        url: "/temu/adjust_task/properties",
        method: 'get',
    })
}

export const adjustTaskBatch = (data) => {
    return service({
        url: "/temu/adjust_task/batch",
        method: 'post',
        data
    })
}