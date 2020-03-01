import { FramePathEnum } from "../../const/ResPathEnum";
import { LevelNumber } from "../../entity/LevelNumber";
import { AudioEnum } from "../../const/AudioEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-03 19:45:11 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-18 09:31:41
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class CountDown extends cc.Component {

    @property({
        displayName: '关卡',
        type: cc.Node
    })
    private levelNode: cc.Node = null;

    @property({
        displayName: '关卡数',
        type: LevelNumber
    })
    private level: LevelNumber = null;

    @property({
        displayName: '倒计时节点',
        type: cc.Node
    })
    private countNode: cc.Node = null;

    @property({
        displayName: '倒计时图片',
        type: cc.Sprite
    })
    private count: cc.Sprite = null;

    @property({
        displayName: '重置按钮',
        type: cc.Node
    })
    private resetBtn: cc.Node = null;

    @property({
        displayName: '返回按钮',
        type: cc.Node
    })
    private returnBtn: cc.Node = null;

    @property({
        displayName: '设置按钮',
        type: cc.Node
    })
    private settingBtn: cc.Node = null;

    private _timer: number = 0;

    private _picIndex: number = 0;

    private _callback: Function = null;

    public init(callback: Function): void {
        this._callback = callback;
        this.countNode.stopAllActions();
        this.levelNode.stopAllActions();
        this.unscheduleAllCallbacks();
        this.resetBtn.active = false;
        this.returnBtn.active = false;
        this.settingBtn.active = false;
        this.node.active = true;
        this._timer = 0;
        this._picIndex = 3;
        this.levelNode.scaleY = 0;
        this.countDown();
        this.playLevelAnim();
        gameContext.audioManager.playTempAudio(null, AudioEnum.COUNT_DOWN);
    }

    public update(dt: number): void {
        this._timer += dt;
        if (this._timer > 1) {
            this._timer = 0;
            this.countDown();
        }
    }

    private countDown(): void {
        let respath = FramePathEnum.COUNTDOWN + this._picIndex;
        let pic = appContext.resourcesManager.getFrame(respath);
        if (!pic) return;
        this.count.spriteFrame = pic;
        this.runAction();
        if (this._picIndex <= 0) {
            this._callback && this._callback();
            this.scheduleOnce(this.showButton, 1.85);
        }
        this._picIndex--;
    }

    private showButton(): void {
        this.resetBtn.active = true;
        this.returnBtn.active = true;
        this.settingBtn.active = true;
        this.node.active = false;
    }

    private runAction(): void {
        this.countNode.stopAllActions();

        if (this._picIndex === 0) {
            this.countNode.scale = 3;
        } else {
            this.countNode.scale = 2;
        }
        this.countNode.opacity = 255;

        let action = cc.sequence(
            cc.scaleTo(0.15, 0.9),
            cc.scaleTo(0.2, 1),
            cc.fadeTo(1.5, 0)
        );
        this.countNode.runAction(action);
    }

    private playLevelAnim(): void {
        let mapLevel = appContext.userDataStorage.currentLevel;
        this.level.level = mapLevel;

        this.levelNode.stopAllActions();

        let action = cc.sequence(
            cc.scaleTo(0.3, 1, 1),
            cc.delayTime(4.45),
            cc.scaleTo(0.1, 1, 0)
        );

        this.levelNode.runAction(action);
    }

    public onDisable(): void {
        this.unscheduleAllCallbacks();
    }

}
