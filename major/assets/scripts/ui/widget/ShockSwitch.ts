import { FramePathEnum } from "../../const/ResPathEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export class AudioSwitch extends cc.Component {

    @property({
        displayName: '按钮背景',
        type: cc.Sprite
    })
    private buttonBg: cc.Sprite = null;

    @property({
        displayName: '按钮',
        type: cc.Node
    })
    private switchBtn: cc.Node = null;

    public onLoad(): void {
        this.updateBtn();
    }

    private switchState(): void {
        gameContext.shockManager.switchShock();
        this.updateBtn();
    }

    private updateBtn(): void {
        let picPath = null;
        let isOn = gameContext.shockManager.isShockOn;
        if (!isOn) {
            picPath = FramePathEnum.BUTTON_OFF;
            this.switchBtn.x = -35;
        } else {
            picPath = FramePathEnum.BUTTON_ON;
            this.switchBtn.x = 35;
        }
        let pic = appContext.resourcesManager.getFrame(picPath);
        if (!pic) return;
        this.buttonBg.spriteFrame = pic;
    }
}
