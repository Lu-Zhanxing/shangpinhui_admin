import request from '@/utils/request.js'

export const reqTradeMarkList = (page,limit) => {
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'
    })
}