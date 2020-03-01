import { MoreGameInfo } from "./MoreGameManager";
import { MoreGameItem } from "./MoreGameItem";
import { ExportTypeEnum } from "../GameCommon/UserData";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";


/**
 * Created by 席庆功
 * Time: 2019/06/20.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class NewMoreGameItem extends MoreGameItem {

    @property(cc.Label)
    protected gameNameNew: cc.Label = null;

    @property(cc.Label)
    protected gameDesc: cc.Label = null;

    public bindData(moreGameInfo: MoreGameInfo, itemOrder: number, clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {
        if (moreGameInfo == null) {
            return;
        }
        this.itemOrder = itemOrder;
        this.gameNameNew.string = moreGameInfo.gameName;
        this.gameDesc.string = moreGameInfo.gameDesc;
        var self = this;
        this.gameIcon.spriteFrame = null;
        GameCommonUtil.getTextureByUrl(moreGameInfo.rectIconUrl, function (texture) {
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
            this.clickAction(this.moreGameInfo, this.partExport ? ExportTypeEnum.PASS_PART_MORE_GAME : ExportTypeEnum.NEW_MORE_GAME, this.itemOrder);
        }
    }
}