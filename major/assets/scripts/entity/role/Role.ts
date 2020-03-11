import { RoleData } from "../../data/RoleData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-19 16:55:30 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-12 00:34:34
 */
const { ccclass, property } = cc._decorator;

const FIREDELAY = 0.2;

@ccclass
export class Role extends cc.Component {

    private _timer: number = 0;

    private _widthLimit: number = 0;

    private _heightLimit: number = 0;

    private _data: RoleData = null;
    public get data(): RoleData {
        return this._data;
    }

    public onLoad(): void {
        this.init();
    }

    public init(): void {
        let systemInfo = window.gameCommon.getSDK.getSystemInfo();
        if (!systemInfo) {
            this._widthLimit = (640 - this.node.width) / 2;
            this._heightLimit = (1386 - this.node.height) / 2;
            return;
        }
        let systemHeight = systemInfo.screenHeight;
        let systemWidth = systemInfo.screenWidth;
        this._widthLimit = (systemWidth - this.node.width) / 2;
        this._heightLimit = (systemHeight - this.node.height) / 2;
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
        if (this._data.isPlayer) {
            this._timer += dt;
            if (this._timer > FIREDELAY) {
                this.fire();
                this._timer = 0;
            }
        }

        let x = cc.misc.lerp(this.node.position.x, this._data.pos.x, 50 * dt);
        let y = cc.misc.lerp(this.node.position.y, this._data.pos.y, 50 * dt);

        if (x > this._widthLimit) {
            x = this._widthLimit;
        } else if (x < -this._widthLimit) {
            x = -this._widthLimit;
        }

        if (y > this._heightLimit) {
            y = this._heightLimit;
        } else if (y < - this._heightLimit) {
            y = - this._heightLimit;
        }

        this.node.position = cc.v2(x, y);
    }

    private fire(): void {
        gameContext.bulletManager.createBullet(this.node.position);
    }

    public touchEnd(): void {
        this._data.isMoveUp = false;
        this._data.isMoveDown = false;
        this._data.isSpeedUp = false;
    }

    public destroySelf(): void {
        this.node.destroy();
    }
}
