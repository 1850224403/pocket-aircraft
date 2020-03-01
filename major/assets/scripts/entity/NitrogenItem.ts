import { Item } from "./Item";
import { PoolEnum } from "../const/PoolEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-14 15:46:43 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-10 18:19:12
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class NitrogenItem extends Item {

    public bindPoolType(): void {
        this._poolType = PoolEnum.ITEM_NITROGEN;
    }
}