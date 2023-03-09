import request from '@/utils/request.js'

// 获取spu列表请求 前台需要传递page,limit,category3Id这三个必须的参数(注意：page,limit在路径中传递，category3Id可以在params中单独传递)
export const reqSpuList = (page,limit,category3Id) => {
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'get',
        params:{category3Id}
    })
}
// 以下是编辑SPU发的四个请求
// 1.获取某一个SPU信息
export const reqGetSpuById = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
// 2.获取品牌
export const reqTrademarkList = () => request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})
// 3.获取SPU图片
export const reqSpuImgList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
// 4.获取平台中全部的销售属性（3个）
export const reqBaseSaleAttrList = () => request({url:'/admin/product/baseSaleAttrList',method:'get'})
