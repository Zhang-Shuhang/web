import service from '@/utils/request'

// @Summary 店小秘同步
export const dxmAddToPlan = (data) => {
    return service({
        url: "/dxm/plan/add",
        method: 'post',
        data
    })
}