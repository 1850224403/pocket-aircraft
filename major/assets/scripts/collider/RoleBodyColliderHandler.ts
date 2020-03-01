import { RoleData } from "../data/RoleData";
import { CollisionTagEnum } from "../const/CollisionTagEnum";
import { Item } from "../entity/Item";
import { FireRocket } from "../entity/FireRocket";
import { RoleAnim } from "../animation/RoleAnim";
import { AudioEnum } from "../const/AudioEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-08 09:25:39 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-15 10:57:41
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleBodyColliderHandler extends cc.Component {

    @property({
        displayName: '玩家动作',
        type: RoleAnim,
    })
    private roleAnim: RoleAnim = null;

    private _data: RoleData = null;

    public bindData(data: RoleData): void {
        this._data = data;
    }

    public onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (!this._data || !this._data.inGround) return;

        let itemComp = null;
        switch (other.tag) {
            case CollisionTagEnum.ITEM_GOLD:
                itemComp = other.node.getComponent(Item);
                if (itemComp) {
                    itemComp.coinItemDestory(this._data.isPlayer);
                }
                if (this._data.isPlayer) {
                    gameContext.audioManager.playTempAudio(this._data, AudioEnum.COIN);
                }
                break;

            case CollisionTagEnum.ITEM_ROCKET:
            case CollisionTagEnum.ITEM_NITROGEN:
            case CollisionTagEnum.ITEM_INVINCIBLE:
                itemComp = other.node.getComponent(Item);
                if (itemComp) {
                    this._data.item = itemComp.data;
                    itemComp.destroySelf();
                }
                break;

            case CollisionTagEnum.FIRE_ROCKET:
                if (this._data.isReliving || this._data.isInvincible) return;
                let fireRocket = other.node.parent.getComponent(FireRocket);
                if (fireRocket) {
                    this._data.hp--;
                    fireRocket.destroySelf();
                    this.roleAnim.explosion();
                    gameContext.audioManager.playTempAudio(this._data, AudioEnum.EXPLODE);
                }
                break;

            default:
                break;
        }
    }
}