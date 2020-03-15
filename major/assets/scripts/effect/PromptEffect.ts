import { Effect } from "./Effect";
import { EffectEnum } from "../const/EffectEnum";
import { FramePathEnum } from "../const/ResPathEnum";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-13 19:51:00 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-18 13:55:44
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class PromptEffect extends Effect {

    public showEffect(type: EffectEnum, pos: cc.Vec2): void {
        let resPath = null;
        switch (type) {
            case EffectEnum.START_PROMPT:
                resPath = FramePathEnum.START_PROMPT;
                break;

            case EffectEnum.LAND_PROMPT:
                resPath = FramePathEnum.LAND_PROMPT;
                break;

            default: break;
        }
        let pic = appContext.resourcesManager.getFrame(resPath);
        if (!pic) return;
        this.effect.spriteFrame = pic;
        this.startTiming();
        let y = pos.y * this.getRate();
        let newPos = cc.v2(pos.x, y);
        this.node.position = newPos;
    }

    private getRate(): number {
        let height = 1136;
        let canvas = cc.Canvas.instance.node;
        let canvasHeight = canvas.height;
        let rate = canvasHeight / height;
        return rate;
    }
}
