import service from '@/utils/request'

export const priceSet = (data) => {
    return service({
        url: "/profit/price/set",
        method: 'post',
        data
    })
}