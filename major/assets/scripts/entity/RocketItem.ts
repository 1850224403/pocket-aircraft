import { Item } from "./Item";
import { PoolEnum } from "../const/PoolEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-14 15:54:40 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-14 15:55:01
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class RocketItem extends Item {

    public bindPoolType(): void {
        this._poolType = PoolEnum.ITEM_ROCKET;
    }
}
