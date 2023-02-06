import request from '@/utils/request.js'

// 获取一级分类
export const reqGetCategory1 = () => {
    return request({
        url:'/admin/product/getCategory1',
        method:'get'
    })
}
// 获取二级分类
export const reqGetCategory2 = (category1Id) => {
    return request({
        url:`/admin/product/getCategory2/${category1Id}`,
        method:'get'
    })
}
// 获取三级分类
export const reqGetCategory3 = (category2Id) => {
    return request({
        url:`/admin/product/getCategory3/${category2Id}`,
        method:'get'
    })
}
// 根据分类获取属性值列表
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => {
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'get'
    })
}
// 保存新增或者修改的属性
export const reqSaveAttr = (data) => {
    return request({
        url:'/admin/product/saveAttrInfo',
        method:'post',
        data: data
    })
}

// 删除商品属性
export const reqDeleteAttr = (attrId) => {
    return request({
        url:`/admin/product/deleteAttr/${attrId}`,
        method:'delete'
    })
}