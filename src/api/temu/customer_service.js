import service from '@/utils/request'

// @Summary 产品同步
export const customerServiceSend = (data) => {
    return service({
        url: "/temu/customer_service/send",
        method: 'post',
        data
    })
}