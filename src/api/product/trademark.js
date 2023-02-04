import request from '@/utils/request.js'

// 品牌列表
export const reqTradeMarkList = (page,limit) => {
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'
    })
}

// 添加或者编辑品牌信息
export const addOrEditTrademark = (data) => {
    // 如果传了id,那么走编辑的请求
    if(data.id){
        return request({
            url:`/admin/product/baseTrademark/update`,
            method:'put',
            data: data
        })
    }else{
        return request({
            url:`/admin/product/baseTrademark/save`,
            method:'post',
            data: data
        })
    }
}

// 删除品牌
export const delTrademark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})