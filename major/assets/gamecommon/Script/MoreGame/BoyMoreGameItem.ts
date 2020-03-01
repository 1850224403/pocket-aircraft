import { ExportTypeEnum } from "../GameCommon/UserData";
import { MoreGameItem } from "./MoreGameItem";
import { MoreGameInfo } from "./MoreGameManager";

/**
 * Created by 孟令超
 * Time: 2019/08/12.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BoyMoreGameItem extends MoreGameItem {

    @property(cc.Label)
    protected gameDesc: cc.Label = null;

    public bindData(moreGameInfo: MoreGameInfo, itemOrder: number, clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {
        if (moreGameInfo == null) {
            return;
        }
        this.itemOrder = itemOrder;
        this.gameDesc.string = moreGameInfo.gameName;
        var self = this;
        this.gameIcon.spriteFrame = null;
        cc.loader.load({ url: moreGameInfo.rectIconUrl, type: "png" }, function (error, texture) {
            if (texture == null) {
                return;
            }
            self.gameIcon.spriteFrame = new cc.SpriteFrame(texture);
        });
        this.clickAction = clickAction;
        this.moreGameInfo = moreGameInfo;
    }

    protected clickItem(): void {
        if (this.clickAction != null) {
            this.clickAction(this.moreGameInfo, ExportTypeEnum.BOY_MORE_GAME, this.itemOrder);
        }
    }
}
