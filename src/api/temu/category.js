import service from '@/utils/request'

// @Summary 存在的类目列表
export const categoryExistList = (params) => {
    return service({
        url: "/temu/category/exist_list",
        method: 'get',
        params
    })
}

// @Summary 存在的类目列表
export const categoryListSearchLeaf = (params) => {
    return service({
        url: "/temu/category/list_search_leaf",
        method: 'get',
        params
    })
}
