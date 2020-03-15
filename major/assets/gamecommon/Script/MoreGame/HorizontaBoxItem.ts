import { MoreGameInfo } from "./MoreGameManager";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { ExportTypeEnum } from "../GameCommon/UserData";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class HorizontaBoxItem extends cc.Component {

    @property(cc.Sprite)
    private icon: cc.Sprite = null;

    @property(cc.Label)
    private gameName: cc.Label = null;

    @property(cc.Node)
    private light: cc.Node = null;

    @property(cc.Node)
    private new: cc.Node = null;

    private moreGameInfo: MoreGameInfo = null;

    private interval: number = 0;

    onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.light.x = -this.light.width;
    }

    onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    update(dt: number): void {
        if (this.moreGameInfo == null || this.moreGameInfo.redPoint) {
            return;
        }
        if (this.interval > 0) {
            this.interval -= dt;
            return;
        }
        let speed = 200;
        if (this.light.x >= this.light.width) {
            this.light.x = -this.light.width;
            this.interval = 1;
            return;
        }
        this.light.x = this.light.x + dt * speed;
    }

    private touchEnd(event: cc.Event.EventTouch): void {
        if (event == null) {
            return;
        }

        let touchPoint = event.getLocation();
        if (touchPoint == null) {
            return;
        }

        let nodePoint = this.node.convertToNodeSpaceAR(touchPoint);
        if (nodePoint == null) {
            return;
        }

        if (Math.abs(nodePoint.x) > this.node.width / 2 || Math.abs(nodePoint.y) > this.node.height / 2) {
            return;
        }

        this.clickItem();
    }

    public bindData(moreGameInfo: MoreGameInfo): void {
        if (moreGameInfo == null) {
            return;
        }
        this.moreGameInfo = moreGameInfo;
        this.light.active = !moreGameInfo.redPoint;
        this.new.active = moreGameInfo.redPoint;
        this.gameName.string = moreGameInfo.gameName;
        this.new.stopAllActions();
        if (moreGameInfo.redPoint) {
            this.new.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.1, 1, 1.2),
                cc.scaleTo(0.15, 1, 0.9),
                cc.delayTime(0.35)
            )));
        }
        let self = this;
        GameCommonUtil.getTextureByUrl(moreGameInfo.gameIconUrl, function (texture) {
            if (texture == null) {
                return;
            }
            self.icon.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    private clickItem(): void {
        if (this.moreGameInfo == null) {
            return;
        }
        StatisticsManager.uploadJumpRecord(this.moreGameInfo.gameAppId, this.moreGameInfo.gameName, "playerClick", ExportTypeEnum.HORIZONTA_GAME_BOX);
        //小游戏自带跳转
        let jumpCallBack = (success: boolean) => {
            if (!success) {
                //跳转失败后判断是否需要二维码跳转
                if (this.moreGameInfo.switchQRCode) {
                    window.gameCommon.getSDK.previewImage(this.moreGameInfo.QRCode);
                }
                return;
            }
            StatisticsManager.uploadJumpRecord(this.moreGameInfo.gameAppId, this.moreGameInfo.gameName, "jumpSuccess", ExportTypeEnum.HORIZONTA_GAME_BOX);
        }
        window.gameCommon.getSDK.navigateToMiniProgram(this.moreGameInfo.gameAppId, this.moreGameInfo.jumpPath, jumpCallBack);
    }
}
