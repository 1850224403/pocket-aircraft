import { CollisionTagEnum } from "../const/CollisionTagEnum";
import { RoleData } from "../data/RoleData";
import { AudioEnum } from "../const/AudioEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-04 15:56:41 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-17 14:56:39
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleFrontColliderHandler extends cc.Component {

    private _data: RoleData = null;

    private _leftY: number = 0;

    // 碰撞弹开距离
    private readonly _flickY: number = 50;

    public bindData(data: RoleData): void {
        this._data = data;
        this._leftY = 0;
    }

    public onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (!this._data) return;
        if (!this._data.inGround || this._data.isReliving || this._data.isInvincible) return;
        switch (other.tag) {
            case CollisionTagEnum.BACK_WHEEL:
                gameContext.audioManager.playTempAudio(this._data, AudioEnum.COLLISION);
                this._data.speed -= 200;
                break;

            case CollisionTagEnum.FRONT_WHEEL:
                gameContext.audioManager.playTempAudio(this._data, AudioEnum.COLLISION);
                let selfWorld = self.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                let otherWorld = other.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                this._leftY = selfWorld.y > otherWorld.y ? this._flickY : -this._flickY;
                let isGameEnd: boolean = gameContext.gameManager.gameIsEnd();
                if (this._data.isPlayer && !isGameEnd) {
                    gameContext.shockManager.longShock();
                }
                break;

            default:
                break;

        }
    }

    public updateSelf(dt: number): void {
        if (!this._leftY) return;
        let speed = 5;
        if (this._leftY > 0) {
            this._data.roadY += speed;
            this._leftY -= speed;
            if (this._leftY < 0) this._leftY = 0;
        } else {
            this._data.roadY -= speed;
            this._leftY += speed;
            if (this._leftY > 0) this._leftY = 0;
        }
    }

}