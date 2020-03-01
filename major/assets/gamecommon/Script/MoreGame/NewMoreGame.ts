import { MoreGame } from "./MoreGame";
import { MoreGameInfo } from "./MoreGameManager";

/**
 * Created by 席庆功
 * Time: 2019/06/20.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class NewMoreGame extends MoreGame {

    private moreGameArray: MoreGameInfo[] = null;

    private clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void = null;

    private firstNavigateFail: boolean = true;

    public bindData(moreGameArray: MoreGameInfo[], clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {

        if (moreGameArray == null) {
            return;
        }

        this.moreGameArray = moreGameArray;
        this.clickAction = clickAction;

        var count = moreGameArray.length;

        for (var i = 0; i < count; i++) {
            this.createMoreGameItem(moreGameArray[i], i + 1, clickAction);
        }
    }

    public navigateFail(moreGameInfo: MoreGameInfo): void {
        if (moreGameInfo == null) {
            return;
        }
        let failIndex = this.moreGameArray.indexOf(moreGameInfo);
        if (failIndex < 0) {
            return;
        }
        let changeIndex = this.firstNavigateFail ? this.moreGameArray.length - 2 : this.moreGameArray.length - 1;
        if (changeIndex < 0) {
            return;
        }
        let changeMoreGameInfo = this.moreGameArray[failIndex] = this.moreGameArray[changeIndex];
        this.moreGameArray[changeIndex] = moreGameInfo;

        let failItem = this.gameItemMap.get(moreGameInfo);
        if (failItem != null) {
            failItem.bindData(changeMoreGameInfo, failIndex + 1, this.clickAction);
        }
        let changeItem = this.gameItemMap.get(changeMoreGameInfo);
        if (changeItem != null) {
            changeItem.bindData(moreGameInfo, changeIndex + 1, this.clickAction);
        }
        this.gameItemMap.set(changeMoreGameInfo, failItem);
        this.gameItemMap.set(moreGameInfo, changeItem);

        this.firstNavigateFail = !this.firstNavigateFail;
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
            cc.fadeIn(0.5)
        ));
    }

    public showCloseMoreGame(): void {
        if (!this.show) {
            return;
        }
        this.show = false;
        this.board.x = 0;
        this.node.active = false;
        if (this.closeAction) {
            this.closeAction();
        }
    }

    protected clickClose(): void {
        this.showCloseMoreGame();
    }

    public bindCloseAction(closeAction: () => void): void {
        this.closeAction = closeAction;
    }
}
