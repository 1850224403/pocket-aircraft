import { Effect } from "./Effect";
import { EffectEnum } from "../const/EffectEnum";
import { FramePathEnum } from "../const/ResPathEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-02-03 11:11:35 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-18 09:33:27
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class HelpEffect extends Effect {

    public showEffect(type: EffectEnum, pos: cc.Vec2): void {
        let resPath = null;

        switch (type) {

            case EffectEnum.LANDING_HELP:
                resPath = FramePathEnum.LANDING_TIP;
                gameContext.gameManager.gamePause();
                break;

            default: break;
        }
        let pic = appContext.resourcesManager.getFrame(resPath);
        if (!pic) return;
        this.effect.spriteFrame = pic;
        this.node.position = pos;
        this.startTiming();
    }
}
