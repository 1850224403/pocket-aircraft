import { MoreGameInfo } from "./MoreGameManager";
import { GameCommon } from "../GameCommon/GameCommon";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";

/**
 * Created by 席庆功
 * Time: 2019/08/06.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class HomeGameItem extends cc.Component {

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

    protected clickAction: (moreGameInfo: MoreGameInfo, itemOrder: number) => void = null;

    protected moreGameInfo: MoreGameInfo = null;

    protected itemOrder: number = 1;

    public bindData(moreGameInfo: MoreGameInfo, itemOrder: number, clickAction: (moreGameInfo: MoreGameInfo, itemOrder: number) => void): void {
        if (moreGameInfo == null) {
            return;
        }
        this.itemOrder = itemOrder;
        this.gameName.string = moreGameInfo.gameName;
        let nameLength = moreGameInfo.gameName.length;
        if (nameLength <= 5) {
            this.gameName.fontSize = 21;
        } else {
            this.gameName.fontSize = 17;
        }
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
            this.clickAction(this.moreGameInfo, this.itemOrder);
        }
    }
}
