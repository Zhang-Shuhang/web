import service from '@/utils/request'

// @Summary 发货计划
export const mzptColorSeriesList = (params) => {
    return service({
        url: "/customize_v3/mzpt_color_series/list",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptColorSeriesListByPage = (params) => {
    return service({
        url: "/customize_v3/mzpt_color_series/list_by_page",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptColorSeriesLoad = (params) => {
    return service({
        url: "/customize_v3/mzpt_color_series/load",
        method: 'get',
        params
    })
}

// @Summary 发货计划
export const mzptColorSeriesUpdate = (data) => {
    return service({
        url: "/customize_v3/mzpt_color_series/update",
        method: 'post',
        data
    })
}