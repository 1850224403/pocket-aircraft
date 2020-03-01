import { RoleData } from "../../data/RoleData";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-13 19:01:39 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-19 16:56:30
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleShadow extends cc.Component {

    private _roleData: RoleData = null;

    private _rotateSpeed: number = 4.2;

    public bindData(data: RoleData): void {
        this._roleData = data;
    }

    public update(dt: number): void {
        if (!this._roleData) return;

        // 更新位置
        let x = this._roleData.pos.x;
        let y = gameContext.mapManager.getY(x, this._roleData.roadY);
        this.node.x = x;
        this.node.y = y;

        // 更新角度
        let v = gameContext.mapManager.getVelocity(x);
        let angle = Util.getAngleFromVector(v);
        let offsetAngle = this.node.angle - angle;
        if (offsetAngle) {
            if (Math.abs(offsetAngle) < this._rotateSpeed) {
                this.node.angle = angle;
            } else {
                let addAngle = offsetAngle > 0 ? -this._rotateSpeed : this._rotateSpeed;
                this.node.angle += addAngle;
            }
        }

        // 更新缩放
        let scale = 1;
        let offsetY = (this._roleData.pos.y - y) / 200;
        if (offsetY > 1) {
            scale = 1 / offsetY;
        }
        this.node.scale = cc.misc.clampf(scale, 0.3, 1);
    }

}