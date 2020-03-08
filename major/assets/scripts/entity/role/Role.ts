import { RoleData } from "../../data/RoleData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-19 16:55:30 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-06 00:14:39
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Role extends cc.Component {

    private _data: RoleData = null;
    public get data(): RoleData {
        return this._data;
    }

    private _playerWidth: number = 0;

    public bindData(data: RoleData): void {
        if (!data) {
            return;
        }
        this._data = data;
        this._playerWidth = this.node.width;
    }

    public touchStart(): void {
    }

    public updateSelf(dt: number): void {
        let x = cc.misc.lerp(this.node.position.x, this._data.pos.x, 50 * dt);
        let y = cc.misc.lerp(this.node.position.y, this._data.pos.y, 50 * dt);
        if (x > 320 - this._playerWidth / 2) {
            x = 320 - this._playerWidth / 2
        } else if (x < -320 + this._playerWidth / 2) {
            x = -320 + this._playerWidth / 2;
        }
        this.node.position = cc.v2(x, y);
    }

    public touchEnd(): void {
        this._data.isMoveUp = false;
        this._data.isMoveDown = false;
        this._data.isSpeedUp = false;
    }

}
