import service from '@/utils/request'

// @Summary 发货台同步
export const shoutRealPictureList = (params) => {
    return service({
        url: "/temu/shout_real_picture/list",
        method: 'get',
        params
    })
}

// @Summary 发货台同步
export const shoutRealPictureUpload = (data) => {
    return service({
        url: "/temu/shout_real_picture/upload",
        method: 'post',
        data
    })
}

// @Summary 发货台同步
export const shoutRealPictureUploadByPrefix = (data) => {
    return service({
        url: "/temu/shout_real_picture/upload_by_prefix",
        method: 'post',
        data
    })
}

// @Summary 发货台同步
export const shoutRealPictureSync = (data) => {
    return service({
        url: "/temu/shout_real_picture/sync",
        method: 'post',
        data
    })
}

// @Summary 发货台同步
export const shoutRealPictureSyncBySpuIds = (data) => {
    return service({
        url: "/temu/shout_real_picture/sync_by_spu_ids",
        method: 'post',
        data
    })
}
