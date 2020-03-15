import { EffectEnum } from "../const/EffectEnum";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-13 20:10:00 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-14 11:09:58
 */

const { ccclass, property } = cc._decorator;

const DISAPPEAR_DELAY = 2;

@ccclass
export abstract class Effect extends cc.Component {

    protected effect: cc.Sprite = null;

    protected _startTiming: boolean = false;

    protected _timer: number = 0;

    public onLoad(): void {
        this.effect = this.node.addComponent(cc.Sprite);
        this.init();
    }

    public init(): void {
        this.effect.spriteFrame = null;
        this._timer = 0;
        this._startTiming = false;
    }

    public abstract showEffect(type: EffectEnum, pos: cc.Vec2): void;

    protected startTiming(): void {
        this._startTiming = true;
        this._timer = 0;
    }

    public update(dt: number): void {
        if (!this._startTiming) return;
        this._timer += dt;
        if (this._timer >= DISAPPEAR_DELAY) {
            this.init();
        }
    }
}
