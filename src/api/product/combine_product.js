import service from '@/utils/request'

export const getImageList = (params) => {
  return service({
      url: "/product_sys/bg_product/list",
      method: 'get',
      params
  })
}

export const combineProductListByPage = (params) => {
    return service({
        url: "/product_sys/combine_product/list",
        method: 'get',
        params
    })
}


export const combineProductUpdate = (data) => {
  return service({
      url: "/product_sys/combine_product/update",
      method: 'post',
      data
  })
}


export const combineProductGenId = () => {
  return service({
      url: "/product_sys/combine_product/gen_id",
      method: 'post'
  })
}

