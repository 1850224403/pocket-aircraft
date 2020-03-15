import { ItemData } from "./ItemData";
import { RoleStateEnum } from "../const/RoleStateEnum";
import { NitrogenEnum } from "../const/NitrogenEnum";
import { RolePropertyLevelData } from "./RolePropertyLevelData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:48:14 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 19:46:06
 */
export class RoleData {

    /** 编号 */
    public id: number = 0;

    public hp: number = 1;

    /** 皮肤编号 */
    public skinId: number = 0;

    /** 是否是玩家 */
    public get isPlayer(): boolean {
        return this.id === 1;
    }

    /** 位置 */
    public pos: cc.Vec2 = cc.Vec2.ZERO;

    /** 角度 */
    public angle: number = 0;

    /** 道路上Y值 */
    private _roadY: number = 0;
    public get roadY(): number {
        return this._roadY;
    }
    public set roadY(value: number) {
        this._roadY = cc.misc.clampf(value, 0, 342);
    }

    /** 速度单位向量 */
    public velocity: cc.Vec2 = cc.Vec2.ZERO;

    /** 速度模 */
    public speed: number = 0;

    /** 速度增长百分比 */
    private _speedIncrease: number = 0;
    public get speedIncrease(): number {
        return this._speedIncrease;
    }
    public set speedIncrease(value: number) {
        value = Math.round(value);
        this._speedIncrease = cc.misc.clampf(value, 0, 100);
    }

    /** 速度减少百分比 */
    private _speedDecrease: number = 0;
    public get speedDecrease(): number {
        return this._speedDecrease;
    }
    public set speedDecrease(value: number) {
        if (this.isInvincible) return;
        value = Math.round(value);
        this._speedDecrease = cc.misc.clampf(value, 0, 100);
    }

    /** 加速度 */
    public a: number = 0;

    /** 加加速度减少百分比 */
    private _aaDecrease: number = 0;
    public get aaDecrease(): number {
        return this._aaDecrease;
    }
    public set aaDecrease(value: number) {
        if (this.isInvincible) return;
        value = Math.round(value);
        this._aaDecrease = cc.misc.clampf(value, 0, 100);
    }

    /** 最大加速度 */
    public maxA: number = 0;

    /** 最大速度 */
    private _maxSpeed: number = 0;
    public get maxSpeed(): number {
        if (this.rolePropertyLevel) return 700 + this.rolePropertyLevel.speedLevel * 25;
        return this._maxSpeed;
    }
    public set maxSpeed(value: number) {
        this._maxSpeed = value;
    }

    /** 加加速度 */
    private _aa: number = 0;
    public get aa(): number {
        if (this.rolePropertyLevel) return 8 + this.rolePropertyLevel.aclerateLevel * 0.5;
        return this._aa;
    }
    public set aa(value: number) {
        this._aa = value;
    }

    /** 平衡性：上下移动值 */
    private _moveYValue: number = 0;
    public get moveYValue(): number {
        if (this.rolePropertyLevel) return 150 + this.rolePropertyLevel.balanceLevel * 5;
        return this._moveYValue;
    }
    public set moveYValue(value: number) {
        this._moveYValue = value;
    }

    /** 技巧：小氮气持续增加速度 */
    private _lowNitrogenAddSpeed: number = 0;
    public get lowNitrogenAddSpeed(): number {
        if (this.rolePropertyLevel) return 250 + this.rolePropertyLevel.skillLevel * 10;
        return this._lowNitrogenAddSpeed;
    }
    public set lowNitrogenAddSpeed(value: number) {
        this._lowNitrogenAddSpeed = value;
    }

    public rolePropertyLevel: RolePropertyLevelData = null;

    /** 是否在地面上 */
    public get inGround(): boolean {
        return this._state === RoleStateEnum.IN_GROUND;
    }

    /** 是否死亡 */
    private _isDead: boolean = false;
    public get isReliving(): boolean {
        return this._isDead;
    }
    public set isReliving(value: boolean) {
        this._isDead = value;
    }

    private _isSpeedUp: boolean = false;
    public get isSpeedUp(): boolean {
        return this._isSpeedUp;
    }
    public set isSpeedUp(value: boolean) {
        this._isSpeedUp = value;
    }

    private _isMoveUp: boolean = false;
    public get isMoveUp(): boolean {
        return this._isMoveUp;
    }
    public set isMoveUp(value: boolean) {
        this._isMoveUp = value;
    }

    private _isMoveDown: boolean = false;
    public get isMoveDown(): boolean {
        return this._isMoveDown;
    }
    public set isMoveDown(value: boolean) {
        this._isMoveDown = value;
    }

    private _isInvincible: boolean = false;
    public get isInvincible(): boolean {
        return this._isInvincible;
    }
    public set isInvincible(value: boolean) {
        this._isInvincible = value;
    }

    private _nitrogenState: NitrogenEnum = NitrogenEnum.IDLE;
    public get nitrogenState(): NitrogenEnum {
        return this._nitrogenState;
    }
    public set nitrogenState(value: NitrogenEnum) {
        this._nitrogenState = value;
    }

    /** 当前状态 */
    private _state: RoleStateEnum = RoleStateEnum.IN_GROUND;
    public get state(): RoleStateEnum {
        return this._state;
    }
    public set state(value: RoleStateEnum) {
        this._state = value;
    }

    /** 滞空时间 */
    public hangTimer: number = 0;

    /** 小氮气⏲ */
    public exTimer: number = 0;

    /** 离地偏移高度 */
    public offsetY: number = 0;

    /** 氮气 */
    private _nitrogen: number = 0;
    public get nitrogen(): number {
        return this._nitrogen;
    }
    public set nitrogen(value: number) {
        this._nitrogen = cc.misc.clampf(value, 0, 100);
    }

    /** 道具列表 */
    public item: ItemData = null;

    /**排名 */
    public ranking: number = 1;

}