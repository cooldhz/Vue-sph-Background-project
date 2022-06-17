import * as tradeMark from '@/api/product/tradeMark'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'
import * as attr from '@/api/product/attr'

// 引入权限相关的接口文件
import * as user from '@/api/permission-quanxian/user'
import role from './permission-quanxian/role'
import menu from './permission-quanxian/menu'
export default {
    tradeMark,
    sku,
    spu,
    attr,


    user,
    role,
    menu

}