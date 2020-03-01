import { RoleAnim } from "../../animation/RoleAnim";
import { RoleBodyColliderHandler } from "../../collider/RoleBodyColliderHandler";
import { RoleFrontColliderHandler } from "../../collider/RoleFrontColliderHandler";
import { RoleBackColliderHandler } from "../../collider/RoleBackColliderHandler";
import { Nitrogen } from "../Nitrogen";
import { Accelerate } from "../Accelerate";
import { Deceleration } from "../Deceleration";
import { RoleSmoke } from "./RoleSmoke";
import { RoleData } from "../../data/RoleData";
import { RoleAnimEnum } from "../../const/RoleAnimEnum";
import { ConstValue } from "../../const/ConstValue";
import { NitrogenEnum } from "../../const/NitrogenEnum";
import { RoleMove } from "./RoleMove";
import { RoleStateEnum } from "../../const/RoleStateEnum";
import { Util } from "../../util/Util";
import { RoleItem } from "./RoleItem";
import { EffectEnum } from "../../const/EffectEnum";
import { EffectPosition } from "../../const/EffectPosition";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-19 16:55:30 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-19 10:39:38
 */
const { ccclass, property } = cc._decorator;

const ROTATE_TIMER: number = 0.2;
const AIR_ROTATE_SPEED: number = 8;

@ccclass
export class Role extends cc.Component {

    @property({
        displayName: '角色动画',
        type: RoleAnim
    })
    private roleAnim: RoleAnim = null;

    @property({
        displayName: '角色移动',
        type: RoleMove
    })
    private roleMove: RoleMove = null;

    @property({
        displayName: '角色道具',
        type: RoleItem
    })
    private roleItem: RoleItem = null;

    @property({
        displayName: '身体碰撞',
        type: RoleBodyColliderHandler
    })
    private bodyColliderHandler: RoleBodyColliderHandler = null;

    @property({
        displayName: '前轮碰撞',
        type: RoleFrontColliderHandler
    })
    private frontColliderHandler: RoleFrontColliderHandler = null;

    @property({
        displayName: '后轮碰撞',
        type: RoleBackColliderHandler
    })
    private backColliderHandler: RoleBackColliderHandler = null;

    @property({
        displayName: '氮气',
        type: Nitrogen
    })
    private nitrogen: Nitrogen = null;

    @property({
        displayName: '加速',
        type: Accelerate,
    })
    private accelerate: Accelerate = null;

    @property({
        displayName: '减速',
        type: Deceleration,
    })
    private deceleration: Deceleration = null;

    @property({
        displayName: '尾气',
        type: RoleSmoke,
    })
    private smoke: RoleSmoke = null;

    @property({
        displayName: '光',
        type: cc.Node
    })
    private shine: cc.Node = null;

    private _isBeginningNitrogen: boolean = false;

    private _delayTime: number = 0;

    private _data: RoleData = null;
    public get data(): RoleData {
        return this._data;
    }

    public bindData(data: RoleData): void {
        this.unscheduleAllCallbacks();
        if (!data) {
            return;
        }
        this._data = data;
        data.hp = 1;
        data.isReliving = false;
        data.item = null;
        data.aaDecrease = 0;
        data.speedIncrease = 0;
        data.speedDecrease = 0;
        data.velocity = cc.Vec2.ZERO.clone();
        data.isMoveUp = false;
        data.isMoveDown = false;
        data.isSpeedUp = false;
        data.isInvincible = false;
        data.nitrogenState = NitrogenEnum.IDLE;
        this.node.zIndex = -this._data.roadY;

        this.roleMove.bindData(data);
        this.roleItem.bindData(data);
        this.nitrogen.bindData(data);
        this.accelerate.bindData(data);
        this.deceleration.bindData(data);
        this.roleAnim.bindData(data);
        this.bodyColliderHandler.bindData(data);
        this.frontColliderHandler.bindData(data);
        this.backColliderHandler.bindData(data, this.nitrogen);
        this.smoke.bindData(data);
        this._isBeginningNitrogen = true;
        this._delayTime = 0;
    }

    public touchStart(): void {
        if (!this._data) return;
        if (this._data.nitrogen >= 100) {
            this.useRoleNitrogen();
        } else if (this._data.exTimer < ConstValue.EX_INTERVAL) {
            this.nitrogen.openNitrogen(NitrogenEnum.LOW);
            if (this._data.isPlayer) {
                if (this._isBeginningNitrogen) {
                    appContext.effectManager.showEffect(EffectEnum.START_PROMPT, EffectPosition.PROMPT);
                } else {
                    appContext.effectManager.showEffect(EffectEnum.LAND_PROMPT, EffectPosition.PROMPT);
                }
            }
        }
        this._data.isSpeedUp = true;
    }

    public updateSelf(dt: number): void {
        if (!this._data) return;

        let angle = this._data.angle;
        if (angle >= 180) {
            angle = angle - 360;
        }
        this._data.angle = angle;
        this.checkDie();
        this.roleMove.updateSelf(dt);

        // 更新位置
        this.node.x = this._data.pos.x;
        let y = this._data.pos.y + this._data.offsetY;
        this.node.y = y;

        // 更新索引
        this.node.zIndex = -this._data.roadY;

        // 更新角度
        this.node.angle = angle;

        this._data.exTimer += dt;
        this.refreshSpeed();
        this.roleAnim.updateSelf(dt);
        this.roleItem.updateSelf(dt);
        this.smoke.updateSelf(dt);
        this.frontColliderHandler.updateSelf(dt);

        if (this._isBeginningNitrogen) {
            this._delayTime += dt;
            if (this._delayTime >= 3) {
                this._isBeginningNitrogen = false;
            }
        }
    }

    public speedUp(): void {
        if (!this._data) return;
        switch (this._data.state) {
            case RoleStateEnum.IN_GROUND:
                if (this._data.speed === this._data.maxSpeed) {
                    return;
                }
                let dt = cc.director.getDeltaTime();
                this._data.a += this._data.aa * dt;
                this._data.a = cc.misc.clampf(this._data.a, 0, this._data.maxA);
                this._data.a = this._data.a * (100 - this._data.aaDecrease) / 100;
                this._data.speed < this.data.maxSpeed && (this._data.speed += this._data.a);
                break;

            case RoleStateEnum.IN_AIR:
                // 使用氮气过程中不能旋转
                let currentState = this._data.nitrogenState;
                if (currentState != NitrogenEnum.IDLE) {
                    return;
                }
                if (this._data.hangTimer < ROTATE_TIMER) {
                    return;
                }
                this.rotateInAir();
                if (this._data.angle <= 0 && this._data.angle >= -8) {
                    this.shine.active = true;
                }
                this.nitrogen.gainNitrogen();
                break;

            default:
                break;
        }
    }

    public speedDown(): void {
        if (!this._data || !this._data.inGround) return;
        if (this._data.speed === 0) {
            return;
        }
        let dt = cc.director.getDeltaTime();
        this._data.a -= this._data.aa * dt;
        this._data.a = cc.misc.clampf(this._data.a, 1, this._data.maxA);
        this._data.speed > 0 && (this._data.speed -= this._data.a);
    }

    private refreshSpeed(): void {
        let speed = this._data.speed;
        let minSpeed = 0;
        let maxSpeed = this._data.maxSpeed;
        if (this._data.nitrogenState != NitrogenEnum.IDLE && this._data.speed <= ConstValue.NITROGEN_SPEED_UP) {
            speed = ConstValue.NITROGEN_SPEED_UP;
        } else if (speed > maxSpeed) {
            this._data.speed -= this._data.maxA;
            speed = this._data.speed < maxSpeed ? maxSpeed : this._data.speed;
        } else if (speed < minSpeed) {
            this._data.speed += this._data.maxA;
            speed = this._data.speed > minSpeed ? minSpeed : this._data.speed;
        }
        this._data.speed = speed;
    }

    private rotateInAir(): void {
        this._data.angle += AIR_ROTATE_SPEED;
    }

    public move(y: number): void {
        // 在空中不能移动
        if (!this._data.inGround) return;
        let delta = cc.director.getDeltaTime();
        let a = this._data.moveYValue * delta;
        if (y > 0) {
            this._data.roadY += a;
            this._data.isMoveUp = true;
            this._data.isMoveDown = false;
        } else if (y < 0) {
            this._data.roadY -= a;
            this._data.isMoveUp = false;
            this._data.isMoveDown = true;
        } else {
            this._data.isMoveUp = false;
            this._data.isMoveDown = false;
        }
    }

    public touchEnd(): void {
        this._data.isMoveUp = false;
        this._data.isMoveDown = false;
        this._data.isSpeedUp = false;
    }

    /** 入场 */
    public admission(): void {
        if (this._data.isPlayer) {
            this.roleAnim.playAnim(RoleAnimEnum.DAI_JI);
            return;
        }
        this.roleAnim.playAnim(RoleAnimEnum.YI_DONG);
        this.node.stopAllActions();
        let delayTime = Util.getRandomFloat(0.2, 1);
        let totalTime = Util.getRandomFloat(1.3, 1.8);
        let moveTime = totalTime - delayTime;
        let seq = cc.sequence(
            cc.delayTime(delayTime),
            cc.moveTo(moveTime, cc.v2(200, this._data.pos.y)),
            cc.callFunc(() => {
                this._data.pos.x += 200;
                this.roleAnim.playAnim(RoleAnimEnum.DAI_JI);
            })
        );
        this.node.runAction(seq);
    }

    private checkDie(): void {
        if (this._data.hp > 0 || this._data.isReliving) {
            return;
        }
        this._data.speed = 0;
        this._data.a = 0;
        this._data.angle = Util.getAngleFromVector(this._data.velocity);
        this.roleAnim.playReliveAnim();
        this._data.isReliving = true;
        this.scheduleOnce(this.relive, 3)
    }

    private relive(): void {
        if (!this._data) return;
        this._data.hp = 1;
        this._data.isReliving = false;
    }

    public useRoleNitrogen(): void {
        if (!this._data.inGround) return;
        this._data.nitrogen = 0;
        this.nitrogen.openNitrogen(NitrogenEnum.HIGH);
    }

    public checkChangeSkin(): void {
        if (!this._data) return;
        let skinId = this._data.skinId;
        let currentSkin = appContext.userDataStorage.currentSkin;
        if (skinId != currentSkin) {
            this._data.skinId = currentSkin;
            this.roleAnim.changeSkin(currentSkin);
        }
    }

}
