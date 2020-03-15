/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-04 16:51:05 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-10 18:21:12
 */
export const enum CollisionTagEnum {

    /** 前轮 */
    FRONT_WHEEL = 1,

    /** 后轮 */
    BACK_WHEEL,

    /** 角色身体 */
    ROLE_BODY,

    /** 道具-金币 */
    ITEM_GOLD = 10,

    /** 道具-火箭 */
    ITEM_ROCKET,

    /** 道具XX */
    ITEM_XX,

    /** 道具-氮气 */
    ITEM_NITROGEN,

    /** 发射的火箭 */
    FIRE_ROCKET,

    /** 沙地 */
    SAND,

    ITEM_INVINCIBLE,

}