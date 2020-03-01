import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { MoreGameItem } from "./MoreGameItem";
import { MoreGameInfo } from "./MoreGameManager";
import { UserData } from "../GameCommon/UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export class MoreGame extends cc.Component {

    @property(cc.Node)
    protected bg: cc.Node = null;

    @property(cc.Node)
    protected board: cc.Node = null;

    @property(cc.Node)
    protected closeNode: cc.Node = null;

    @property(cc.Node)
    protected moreGameContent: cc.Node = null;

    @property(cc.Prefab)
    protected moreGameItemPrefab: cc.Prefab = null;

    protected originalPosition: cc.Vec2 = null;

    protected originalWidth: number = 0;

    protected gameItemMap: Map<MoreGameInfo, MoreGameItem> = new Map();

    protected show: boolean = false;

    protected closeAction: () => void = null;

    //是否是过关导出
    public partExport: boolean = false;

    protected currentGender: number = null;

    protected readonly itemArrays: Array<cc.Node> = [];

    onLoad(): void {
        this.originalPosition = this.board.position.clone();
        this.originalWidth = this.board.width;
    }

    onEnable(): void {
        this.board.stopAllActions();
        this.board.x = -this.originalWidth;
        this.showMoreGame();
    }

    update(dt: number): void {
        if (this.itemArrays == null || this.itemArrays.length <= 0) {
            return;
        }
        // 检测到是男性用户时,需要显示男性游戏
        if (this.currentGender != UserData.data.gender && UserData.data.gender == 1) {
            this.currentGender = UserData.data.gender;
            this.showBoyGame();
        }
    }

    public bindData(moreGameArray: MoreGameInfo[], clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {
        if (moreGameArray == null) {
            return;
        }
        let count = moreGameArray.length;
        console.log(moreGameArray);
        for (let i = 0; i < count && i < 9; i++) {
            this.createMoreGameItem(moreGameArray[i], i + 1, clickAction);
        }
    }

    protected createMoreGameItem(moreGameInfo: MoreGameInfo, itemOrder: number, clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {
        var instant = GameCommonPool.requestInstant(this.moreGameItemPrefab);
        if (instant == null) {
            return;
        }
        instant.setParent(this.moreGameContent);
        var gameItem = instant.getComponent(MoreGameItem);
        if (gameItem == null) {
            return;
        }
        this.gameItemMap.set(moreGameInfo, gameItem);
        gameItem.bindData(moreGameInfo, itemOrder, clickAction);
        gameItem.partExport = this.partExport;
        instant.active = !moreGameInfo.boyGame;
        this.itemArrays.push(instant);
    }

    protected showMoreGame(): void {
        if (this.show) {
            return;
        }
        this.closeNode.opacity = 0;
        this.show = true;
        var self = this;
        this.board.runAction(cc.sequence(
            cc.moveTo(0.5, this.originalPosition).easing(cc.easeQuarticActionOut()),
            cc.callFunc(function () {
                self.closeNode.runAction(cc.fadeIn(0.3));
            })
        ));
        this.bg.opacity = 0;
        this.bg.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.fadeTo(0.5, 177)
        ));
    }

    public showCloseMoreGame(): void {
        if (!this.show) {
            return;
        }
        this.show = false;
        var self = this;
        this.board.runAction(cc.sequence(
            cc.moveBy(0.5, cc.v2(-this.originalWidth, 0)).easing(cc.easeQuadraticActionOut()),
            cc.callFunc(function () {
                self.node.active = false;
                if (self.closeAction) {
                    self.closeAction();
                }
            })
        ));
    }

    protected showBoyGame(): void {
        for (let item of this.itemArrays) {
            if (item == null) {
                continue;
            }
            item.active = true;
        }
    }

    public bindCloseAction(closeAction: () => void): void {
        this.closeAction = closeAction;
    }

    public navigateFail(moreGameInfo: MoreGameInfo): void {

    }

    protected clickClose(): void {
        this.showCloseMoreGame();
    }
}
