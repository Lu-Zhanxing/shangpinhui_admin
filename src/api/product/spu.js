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

// 保存编辑或者添加的SpuInfo请求
export const AddOrEditSpuInfo = (data) => {
    // 如果有id，那么走编辑的请求
    if(data.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data})
    }else{
        return request({url:'/admin/product/saveSpuInfo',method:'post',data})
    }
}

// 删除SPU
export const delSpu = (spuId) => request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// 点击添加sku的一些请求
// 1.获取平台属性
export const reqGetAttrInfoList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
// 2.获取销售属性
export const reqGetSaleList = (spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})
// 3.获取图片列表，和上边请求一样，直接用：reqSpuImgList
// 保存Sku
export const reqSaveSku = (data) => {
    return request({
        url:'/admin/product/saveSkuInfo',
        method:'post',
        data
    })
}