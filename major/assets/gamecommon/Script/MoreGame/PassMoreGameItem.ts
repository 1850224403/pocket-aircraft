import { MoreGameInfo } from "./MoreGameManager";

/**
 * Created by 席庆功
 * Time: 2019/06/15.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class PassMoreGameItem extends cc.Component {

    @property({
        type: cc.Sprite,
        displayName: "游戏Icon"
    })
    private gameIcon: cc.Sprite = null;

    @property({
        type: cc.Label,
        displayName: "游戏名称"
    })
    private gameName: cc.Label = null;

    private clickAction: (moreGameInfo: MoreGameInfo) => void = null;

    private moreGameInfo: MoreGameInfo = null;

    public bindData(moreGameInfo: MoreGameInfo, clickAction: (moreGameInfo: MoreGameInfo) => void): void {

        if (moreGameInfo == null) {
            return;
        }

        this.moreGameInfo = moreGameInfo;

        let self = this;

        if (moreGameInfo.gameIconUrl) {
            cc.loader.load({ url: moreGameInfo.gameIconUrl, type: "png" }, function (error, texture) {
                if (texture == null) {
                    return;
                }
                self.gameIcon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }

        this.gameName.string = moreGameInfo.gameName;

        this.clickAction = clickAction;
    }

    private clickItem(): void {
        if (this.clickAction) {
            this.clickAction(this.moreGameInfo);
        }
    }
}
