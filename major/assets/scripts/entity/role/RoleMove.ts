import { RoleData } from "../../data/RoleData";
import { RoleStateEnum } from "../../const/RoleStateEnum";
import { Util } from "../../util/Util";
import { RoadEnum } from "../../const/RoadEnum";
import { NitrogenDialog } from "../../ui/dialog/NitrogenDialog";
import { EffectEnum } from "../../const/EffectEnum";
import { EffectPosition } from "../../const/EffectPosition";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-19 19:20:37 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-21 19:12:06
 */
const { ccclass, property } = cc._decorator;

const GROUND_ROTATE_SPEED: number = 170;
const WHEEL_OFFSET: number = 30;

@ccclass
export class RoleMove extends cc.Component {

    private _timer: number = 0;

    private _isStartTiming: boolean = false;

    private _data: RoleData = null;

    private _firstInAir: boolean = false;

    private _firstAirToLand: boolean = false;

    public bindData(data: RoleData): void {
        this._data = data;
        this._firstInAir = true;
        this._firstAirToLand = true;
        this._timer = 0;
        this._isStartTiming = false;
    }

    public updateSelf(dt: number): void {
        if (this._isStartTiming) {
            this._timer += dt;
            if (this._timer >= 0.1) {
                gameContext.shockManager.longShock();
                this._isStartTiming = false;
            }
        }
        if (!this._data) return;
        let speed = this.clacSpeed();
        let lastX = this._data.pos.x;
        let lastY = this._data.pos.y;
        let mapManager = gameContext.mapManager;
        let angle = this._data.angle;
        let x, y, mapY, offsetY = 0;
        switch (this._data.state) {
            case RoleStateEnum.IN_GROUND:
                // 计算位置
                this._data.velocity = mapManager.getVelocity(lastX);
                x = lastX + this._data.velocity.x * speed * dt;
                mapY = mapManager.getRoleY(x, this._data.roadY);
                if (mapManager.checkPassHeight(lastX, x) && speed > 100) {
                    this.switchState(RoleStateEnum.IN_AIR);
                    let currentLevel = appContext.userDataStorage.currentLevel;
                    if (this._data.isPlayer && currentLevel === 1 && this._firstInAir) {
                        appContext.uiManager.showUI(NitrogenDialog);
                        this._firstInAir = false;
                    }
                }
                y = mapY;
                angle = Util.getAngleFromVector(this._data.velocity);
                offsetY = this.calcWheelOffset();
                break;

            case RoleStateEnum.IN_AIR:
                this._data.hangTimer += dt;
                let v = this._data.velocity.clone();
                let vy = v.y * speed - 560 * this._data.hangTimer;
                x = lastX + v.x * speed * dt;
                y = lastY + vy * dt;
                mapY = mapManager.getRoleY(x, this._data.roadY);

                // 计算前轮将要到达的坐标信息
                let nfw = this.node.parent.convertToWorldSpaceAR(cc.v2(this._data.pos.x + WHEEL_OFFSET, this._data.pos.y - 40));
                let nfl = this.node.parent.convertToNodeSpaceAR(nfw);
                let fgy = mapManager.getRoleY(nfl.x, this._data.roadY);
                let frontOffsetY = nfl.y - fgy;
                // 计算后轮将要到达的坐标信息
                let nbw = this.node.parent.convertToWorldSpaceAR(cc.v2(this._data.pos.x - WHEEL_OFFSET, this._data.pos.y - 40));
                let nbl = this.node.parent.convertToNodeSpaceAR(nbw);
                let bgy = mapManager.getRoleY(nbl.x, this._data.roadY);
                let backOffsetY = nbl.y - bgy;
                if (vy < 0 && (frontOffsetY < 0 || backOffsetY < 0)) {
                    y = mapY;
                    offsetY = this.calcWheelOffset();
                    this.land(x, y, offsetY);
                }
                break;

            default:
                break;
        }

        let offsetAngle = this._data.angle - angle;
        if (offsetAngle) {
            let dir = offsetAngle > 0 ? -1 : 1;
            let addAngle = dir * GROUND_ROTATE_SPEED * dt;
            if (Math.abs(offsetAngle) < Math.abs(addAngle)) {
                this._data.angle = angle;
            } else {
                this._data.angle += addAngle;
            }
        }

        this._data.pos.x = x;
        this._data.pos.y = y;
        this._data.offsetY = offsetY;
    }

    /** 落地分解速度 */
    private landDecomposeVelocity(landX: number): void {
        let mapManager = gameContext.mapManager;
        let groundV = mapManager.getVelocity(landX);
        let currentV = this._data.velocity.clone();
        let dot = groundV.dot(currentV);
        let cross = groundV.cross(currentV);
        if (cross === 0) {
            // 平行
        } else if (cross > 0) {
            // 逆时针
        } else {
            // 顺时针
            if (dot === 0) {
                this._data.speed = 0;
            } else if (dot > 0) {
                this._data.speed *= dot;
            } else {
                this._data.speed = 0;
            }
        }
    }

    public switchState(state: RoleStateEnum): void {
        if (!this._data || this._data.state === state) return;
        switch (state) {
            case RoleStateEnum.IN_GROUND:
                this._data.exTimer = 0;
                break;

            case RoleStateEnum.IN_AIR:
                this._data.hangTimer = 0;
                break;

            default:
                break;
        }
        this._data.state = state;
    }

    private calcWheelOffset(): number {
        let offsetY = 0;
        let lfw = this.node.convertToWorldSpaceAR(cc.v2(WHEEL_OFFSET, 0));
        let lbw = this.node.convertToWorldSpaceAR(cc.v2(-WHEEL_OFFSET, 0));
        offsetY = Math.abs(lfw.y - lbw.y) / 2;
        return offsetY;
    }

    private land(x: number, y: number, offsetY: number): void {
        let angle = this._data.angle;
        if ((angle > 90 && angle < 180) || (angle > -180 && angle < -90)) {
            this._data.hp--;
        } else {
            this.landDecomposeVelocity(x);
            // 生成落地特效
            let pos = cc.v2(x, y - offsetY - 40);
            gameContext.gameSpawner.spawnLandEffect(pos, this._data.roadY);
        }
        if (this._data.isPlayer) {
            this._isStartTiming = true;
            this._timer = 0;
        }
        this.switchState(RoleStateEnum.IN_GROUND);
        let currentLevel = appContext.userDataStorage.currentLevel;
        if (this._data.isPlayer && currentLevel === 2 && this._firstAirToLand) {
            appContext.effectManager.showEffect(EffectEnum.LANDING_HELP, EffectPosition.LAND_HELP);
            this._firstAirToLand = false;
        }
    }

    private clacSpeed(): number {
        let pos = this._data.pos.clone();
        let currentGround = gameContext.mapManager.getPosGround(pos);
        let speedDecrease = 0;
        let aaDecrease = 0;
        switch (currentGround) {
            case RoadEnum.SAND:
                if (this._data.isInvincible) break;
                speedDecrease = 30;
                aaDecrease = 20;
                break;

            default:
                break;
        }
        this._data.speedDecrease = speedDecrease;
        this._data.aaDecrease = aaDecrease;
        let speed = this._data.speed * (100 + this._data.speedIncrease - this._data.speedDecrease) / 100;
        return speed;
    }

}