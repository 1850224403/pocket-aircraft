import { CollisionTagEnum } from "../const/CollisionTagEnum";
import { RoleData } from "../data/RoleData";
import { Nitrogen } from "../entity/Nitrogen";
import { NitrogenEnum } from "../const/NitrogenEnum";
import { AudioEnum } from "../const/AudioEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-04 15:57:29 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-20 17:10:54
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleBackColliderHandler extends cc.Component {

    private _data: RoleData = null;

    private _nitrogen: Nitrogen = null;

    public bindData(data: RoleData, nitrogen: Nitrogen): void {
        this._data = data;
        this._nitrogen = nitrogen;
    }

    public onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (!this._data || !this._data.inGround || this._data.isReliving) return;
        if (other.tag === CollisionTagEnum.FRONT_WHEEL) {
            this._nitrogen && this._nitrogen.openNitrogen(NitrogenEnum.LOW);
            gameContext.audioManager.playTempAudio(this._data, AudioEnum.COLLISION);

        }
    }

}