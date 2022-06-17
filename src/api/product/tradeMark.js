import request from '@/utils/request'

//获取品牌列表接口
//  /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

// 添加品牌 /admin/product/baseTrademark/save   post    两个参数：品牌名称、品牌logo
// 修改品牌 /admin/product/baseTrademark/update     put 三个参数：id、品牌名称、品牌logo
export const reqAddTradeMark = (data) => request({ url: `/admin/product/baseTrademark/save`, data, method: 'post' });
export const reqUpdateTradeMark = (data) => request({ url: `/admin/product/baseTrademark/update`, data, method: 'put' });

//删除品牌
///admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });
