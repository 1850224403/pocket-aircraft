import { Item } from "../Item";
import { PoolEnum } from "../../const/PoolEnum";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-10 18:18:03 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-10 18:19:05
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class InvincibleItem extends Item {

    public bindPoolType(): void {
        this._poolType = PoolEnum.ITEM_INVINCIBLE;
    }

}
