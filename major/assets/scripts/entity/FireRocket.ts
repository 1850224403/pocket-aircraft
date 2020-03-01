import { PoolEnum } from "../const/PoolEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-09 15:22:45 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-15 11:02:43
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class FireRocket extends cc.Component {

    private _roadY: number = 0;

    private _speed: number = -1500;

    private _timer: number = 0;

    private _autoDestoryDelay: number = 10;

    public bindData(roadY: number): void {
        this._timer = 0;
        this._roadY = roadY;
    }

    public update(dt: number): void {
        this._timer += dt;
        if (this._timer > this._autoDestoryDelay) {
            this.destroySelf();
        }

        let x = this.node.x + this._speed * dt;
        let y = gameContext.mapManager.getY(x, this._roadY);
        this.node.x = x;
        this.node.y = y;
    }

    public destroySelf(): void {
        appContext.poolManager.add(PoolEnum.FIRE_ROCKET, this.node);
    }

}
