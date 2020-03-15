import { MoreGameInfo } from "./MoreGameManager";
import { ExportTypeEnum } from "../GameCommon/UserData";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class MoreGameItem extends cc.Component {

    @property({
        type: cc.Label,
        displayName: "游戏名称"
    })
    protected gameName: cc.Label = null;

    @property({
        type: cc.Sprite,
        displayName: "游戏icon"
    })
    protected gameIcon: cc.Sprite = null;

    protected clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void = null;

    protected moreGameInfo: MoreGameInfo = null;

    protected itemOrder: number = 1;

    //是否是过关导出
    public partExport: boolean = false;

    public bindData(moreGameInfo: MoreGameInfo, itemOrder: number, clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {
        if (moreGameInfo == null) {
            return;
        }
        this.itemOrder = itemOrder;
        this.gameName.string = moreGameInfo.gameName;
        var self = this;
        this.gameIcon.spriteFrame = null;
        GameCommonUtil.getTextureByUrl(moreGameInfo.gameIconUrl, function (texture) {
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
            this.clickAction(this.moreGameInfo, ExportTypeEnum.MORE_GAME, this.itemOrder);
        }
    }
}
