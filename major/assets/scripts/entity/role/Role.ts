import { RoleData } from "../../data/RoleData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-19 16:55:30 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-05 00:57:21
 */
const { ccclass, property } = cc._decorator;

const ROTATE_TIMER: number = 0.2;
const AIR_ROTATE_SPEED: number = 8;

@ccclass
export class Role extends cc.Component {

    private _data: RoleData = null;
    public get data(): RoleData {
        return this._data;
    }

    public bindData(data: RoleData): void {
        if (!data) {
            return;
        }
        this._data = data;

    }

    public touchStart(): void {
    }

    public updateSelf(dt: number): void {
        let x = cc.misc.lerp(this.node.position.x, this._data.pos.x, 50 * dt);
        let y = cc.misc.lerp(this.node.position.y, this._data.pos.y, 50 * dt);
        this.node.position = cc.v2(x, y);
    }

    public touchEnd(): void {
        this._data.isMoveUp = false;
        this._data.isMoveDown = false;
        this._data.isSpeedUp = false;
    }

}
