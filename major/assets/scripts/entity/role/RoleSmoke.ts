import { RoleData } from "../../data/RoleData";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-14 16:28:56 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-19 16:56:42
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleSmoke extends cc.Component {

    @property({
        displayName: '粒子效果',
        type: cc.ParticleSystem,
    })
    private smoke: cc.ParticleSystem = null;

    private _smokeLife: number = 0;

    private _data: RoleData = null;

    public bindData(data: RoleData): void {
        this._data = data;
        this._smokeLife = 0.5;
    }

    public updateSelf(dt: number): void {
        if (!this._data) return;
        if (!this._data.inGround || this._data.speed < 10) {
            this.smoke.life = 0;
            return;
        }
        if (this.smoke.life === 0) this.smoke.resetSystem();
        //在坡上受重力
        if(this._data.velocity.y > 0) {
            this.smoke.gravity.y = -1000;
        } else if(this._data.velocity.y === 0) {
            this.smoke.gravity.y = 0;
        }
        let proportion = this._data.speed / this._data.maxSpeed;
        this.smoke.life = this._smokeLife * proportion;
        this.node.angle = -this._data.angle;
    }
}
