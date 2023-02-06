import request from '@/utils/request.js'

// 获取spu列表请求 前台需要传递page,limit,category3Id这三个必须的参数(注意：page,limit在路径中传递，category3Id可以在params中单独传递)
export const reqSpuList = (page,limit,category3Id) => {
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'get',
        params:{category3Id}
    })
}
