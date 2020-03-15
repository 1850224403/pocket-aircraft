import { ItemEnum } from "../../const/ItemEnum";
import { NitrogenEnum } from "../../const/NitrogenEnum";
import { RoleData } from "../../data/RoleData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-02-07 13:47:46 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-09 00:35:36
 */
const { ccclass, property } = cc._decorator;

const ROCKET_X_OFFSET: number = 23;
const INVINCIBLE_INTERVAL: number = 3;

@ccclass
export class RoleItem extends cc.Component {

    @property({
        displayName: '护盾',
        type: cc.Node
    })
    private shield: cc.Node = null;

    private _data: RoleData = null;

    private invincibleTimer: number = 0;

    public bindData(data: RoleData): void {
        this._data = data;
    }

    public updateSelf(dt: number): void {
        if (!this._data) return;
        this.autoUseItem();
        this.updateInvincible(dt);
    }

    public autoUseItem(): void {
        let item = this._data.item;
        if (!item) return;
        switch (item.type) {
            case ItemEnum.NITROGEN:
                break;

            case ItemEnum.ROCKET:
                if (!this._data.inGround) return;
                this.useRocket();
                break;

            case ItemEnum.INVINCIBLE:
                this._data.aaDecrease = 0;
                this._data.speedDecrease = 0;
                this._data.isInvincible = true;
                this.shield.active = true;
                this.invincibleTimer = INVINCIBLE_INTERVAL;
                break;

            default:
                break;
        }
        this._data.item = null;
    }

    private useRocket(): void {
    }

    private updateInvincible(dt: number): void {
        if (!this._data.isInvincible) return;
        this.invincibleTimer -= dt;
        if (this.invincibleTimer <= 0) {
            this._data.isInvincible = false;
            this.shield.active = false;
        }
    }
}