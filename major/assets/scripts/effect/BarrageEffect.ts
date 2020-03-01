import { Effect } from "./Effect";
import { EffectEnum } from "../const/EffectEnum";
import { FramePathEnum } from "../const/ResPathEnum";
import { Util } from "../util/Util";
import { LogUtil } from "../util/LogUtil";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-17 19:31:46 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-18 18:01:11
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class BarrageEffect extends Effect {

    private _barrageLabel: cc.Label = null;

    private _stringIndex: number = 1;

    private get barrageLabel(): cc.Label {
        if (!this._barrageLabel) {
            let labelNode = new cc.Node('Label');
            labelNode.position = cc.v2(30, -5);
            labelNode.scaleX = -1;
            labelNode.color = new cc.Color(0, 0, 0, 255);
            this.node.addChild(labelNode);
            this._barrageLabel = labelNode.addComponent(cc.Label);
            labelNode.width = 270;
            this.barrageLabel.fontSize = 23;
            this.barrageLabel.lineHeight = 25;
        }
        return this._barrageLabel;
    }

    public showEffect(type: EffectEnum, pos: cc.Vec2): void {
        this.node.stopAllActions();
        this.setBackground();
        let barrageStr = null;
        switch (this._stringIndex) {
            case 1:
                barrageStr = '碰撞敌人的前轮，获得加速！';
                break;

            case 2:
                barrageStr = '重新点击即可使用氮气！';
                break;

            case 3:
                barrageStr = '开局加速取决于点击时间！';
                break;

            case 4:
                barrageStr = '上下滑动屏幕撞击敌人！';
                break;

            case 5:
                barrageStr = '按住屏幕加速移动！';
                break;

            case 6:
                barrageStr = '倒计时期间可以踩油门哦！';
                break;

            case 7:
                barrageStr = '道具都是直接使用的~';
                break;

            default: break;
        }
        this.barrageLabel.string = barrageStr;
        this.node.position = pos;
        let action = cc.sequence(
            cc.moveBy(10, cc.v2(-1200, 0)),
            cc.callFunc(() => {
                this.init();
            })
        );
        this.node.runAction(action);
        this._stringIndex += 1;
        if (this._stringIndex > 7) {
            this._stringIndex = 1;
        }
    }

    public init(): void {
        this.effect.spriteFrame = null;
        this.barrageLabel.string = '';
    }

    public setBackground(): void {
        let pic = appContext.resourcesManager.getFrame(FramePathEnum.BARRAGE_BACKGROUND);
        if (!pic) return;
        this.effect.spriteFrame = pic;
    }
}
