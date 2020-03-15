import { Role } from "../role/Role";
import { AILevelEnum } from "../../const/AILevelEnum";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-03 16:14:41 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 19:26:08
 */
const { ccclass, property } = cc._decorator;

@ccclass
export abstract class AI {

    protected _level: AILevelEnum = AILevelEnum.LOW;

    protected _role: Role = null;

    protected _timer: number = 0;

    protected _delay: number = 0;

    protected _actionTimer: number = 0;

    protected _actionDelay: number = 5;

    protected _isStarting: boolean = false;

    /** 落后玩家后追逐玩家 */
    protected _isChasing: boolean = false;

    protected _chasingSpeedIncrease: number = 0;

    // 需要加速的间隔
    protected _needSpeedUpOffset: number = 320;

    // 可以重制速度的间隔
    protected _canResetSpeedOffset: number = 50;

    // 速度增长百分比
    protected _speedIncreaseValue: number = 60;

    private _isLanded: boolean = false;

    private _upAngle: number = 0;

    private _downAngle: number = 0;

    public bindData(aiLevel: AILevelEnum, role: Role, delay: number): void {
        this._level = aiLevel;
        this._role = role;
        this._delay = delay;
        this._isStarting = false;
        this.refreshLandAngle();
        this.initChasingAI();
    }

    private initChasingAI(): void {
        this._isChasing = false;
        this._chasingSpeedIncrease = 0;
        switch (this._level) {
            case AILevelEnum.LOW:
            case AILevelEnum.MIDDLE:
                this._needSpeedUpOffset = 500;
                this._canResetSpeedOffset = 200;
                this._speedIncreaseValue = 20;
                break;

            case AILevelEnum.HIGH:
                this._needSpeedUpOffset = 500;
                this._canResetSpeedOffset = 200;
                this._speedIncreaseValue = 30;
                break;

            default:
                break;
        }
    }

    public updateSelf(dt: number): void {
        if (!this._isStarting) {
            this._timer += dt;
            if (this._timer > this._delay) {
                this._isStarting = true;
                this._role && this._role.touchStart();
            }
        }
        this.aiSpeedUp();
    }

    /**
     * 检查落后玩家自动加速
     * FIXME: 追逐逻辑待优化
     */
    protected checkLeftPlayer(): void {
        let playerData = gameContext.battleData.playerData;
        if (!playerData) return;
        let playerX = playerData.pos.x;
        let selfData = this._role.data;
        if (!selfData) return;
        let selfX = selfData.pos.x;
        let offset = playerX - selfX;
        if (!this._isChasing && this._chasingSpeedIncrease > 0) {
            this._chasingSpeedIncrease--;
            selfData.speedIncrease--;
        } else if (!this._isChasing && offset > this._needSpeedUpOffset) {
            selfData.speedIncrease += this._speedIncreaseValue;
            this._chasingSpeedIncrease = this._speedIncreaseValue;
            this._isChasing = true;
        } else if (this._isChasing && offset < this._canResetSpeedOffset) {
            this._isChasing = false;
        }
    }

    private aiSpeedUp(): void {
        let data = this._role.data;
        if (!data) {
            return;
        }
        let angle = data.angle;
        let inGround = data.inGround;
        if (inGround) {
            this._role.speedUp();
            if (!this._isLanded) {
                this.refreshLandAngle();
                this._isLanded = true;
            }
        } else {
            if (this._isLanded) {
                this._isLanded = false;
            }
            if (angle > this._upAngle || angle < this._downAngle) {
                this._role.speedUp();
            }

        }
    }

    private refreshLandAngle(): void {
        this._upAngle = Util.getRandomInt(5, 15);
        this._downAngle = Util.getRandomInt(-60, -10);
    }

}