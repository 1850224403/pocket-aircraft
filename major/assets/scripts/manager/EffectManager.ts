import { EffectEnum } from "../const/EffectEnum";
import { Util } from "../util/Util";
import { PromptEffect } from "../effect/PromptEffect";
import { HelpEffect } from "../effect/HelpEffect";
import { Effect } from "../effect/Effect";
import { EffectTypeEnum } from "../const/EffectTypeEnum";
import { BarrageEffect } from "../effect/BarrageEffect";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-13 19:24:06 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 16:36:43
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class EffectManager extends cc.Component {

    private promptEffect: PromptEffect = null;

    private helpEffect: HelpEffect = null;

    private barrageEffect: BarrageEffect = null;

    private _effectType: EffectTypeEnum = null;

    private get effect(): Effect {
        if (this._effectType === EffectTypeEnum.PROMPT) {
            if (!this.promptEffect) {
                this.promptEffect = Util.createComp(this.node, 'prompt', PromptEffect);
            }
            return this.promptEffect;
        } else if (this._effectType === EffectTypeEnum.BARRAGE) {
            if (!this.barrageEffect) {
                this.barrageEffect = Util.createComp(this.node, 'barrage', BarrageEffect);
                this.barrageEffect.node.scaleX = -1;
            }
            return this.barrageEffect;
        } else {
            if (!this.helpEffect) {
                this.helpEffect = Util.createComp(this.node, 'help', HelpEffect);
            }
            return this.helpEffect;
        }
    }

    public onLoad(): void {
        this.effect.init();
    }

    public initBarrage(): void {
        if (!this.barrageEffect) return;
        this.barrageEffect.init();
    }

    public showEffect(type: EffectEnum, pos: cc.Vec2): void {
        this._effectType = null;
        switch (type) {
            case EffectEnum.LAND_PROMPT:
            case EffectEnum.START_PROMPT:
                this._effectType = EffectTypeEnum.PROMPT;
                break;


            case EffectEnum.LANDING_HELP:
                this._effectType = EffectTypeEnum.HELP;
                break;

            case EffectEnum.BARRAGE:
                this._effectType = EffectTypeEnum.BARRAGE;

            default:
                break;
        }
        this._effectType && this.effect.showEffect(type, pos);
    }
}
