import request from '@/utils/request.js'

// 获取sku列表
export const reqSkulist = (page,limit) => request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// sku下架
export const reqCancelSale = (skuId) => request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// sku上架
export const reqOnSale = (skuId) => request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 获取sku详情
export const reqSkuDetail = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})

// 删除sku
export const reqDelSku = (skuId) => request({url:`/admin/product/deleteSku/${skuId}`,method:'delete'})
