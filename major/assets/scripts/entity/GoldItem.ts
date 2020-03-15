import { Item } from "./Item";
import { PoolEnum } from "../const/PoolEnum";
import { WorldEventManager } from "../../gamecommon/Script/GameCommon/WorldEventManager";
import { EventEnum } from "../const/EventEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-09 09:40:19 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-14 15:52:25
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GoldItem extends Item {

    public bindPoolType(): void {
        this._poolType = PoolEnum.ITEM_GOLD;
    }

    public coinItemDestory(isPlayer: boolean): void {
        this.destroySelf();
        if (!isPlayer) return;
        let cameraPos = gameContext.cameraManager.getCameraPos();
        let coinPos = this.node.position.sub(cameraPos);
        WorldEventManager.triggerEvent(EventEnum.CREATE_COIN, coinPos);
    }

}