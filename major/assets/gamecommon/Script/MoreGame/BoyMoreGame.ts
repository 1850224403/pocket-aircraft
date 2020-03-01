import { MoreGame } from "./MoreGame";
import { MoreGameInfo } from "./MoreGameManager";
import { BoyMoreGameItem } from "./BoyMoreGameItem";

/**
 * Created by 孟令超
 * Time: 2019/08/12.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BoyMoreGame extends MoreGame {

    @property({
        type: BoyMoreGameItem,
        displayName: "游戏1"
    })
    protected item1: BoyMoreGameItem = null;

    @property({
        type: BoyMoreGameItem,
        displayName: "游戏2"
    })
    protected item2: BoyMoreGameItem = null;

    public bindData(moreGameArray: MoreGameInfo[], clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void): void {

        this.item1.node.active = false;
        this.item2.node.active = false;

        if (moreGameArray == null) {
            return;
        }

        var count = moreGameArray.length;
        if (count < 1) {
            return;
        }
        this.item1.node.active = true;
        this.item1.node.y = -495;
        let gameInfo1 = moreGameArray[0];
        this.item1.bindData(gameInfo1, 1, clickAction);
        if (count < 2) {
            return;
        }
        this.item2.node.active = true;
        this.item1.node.y = -269;
        this.item2.node.y = -699;
        let gameInfo2 = moreGameArray[1];
        this.item2.bindData(gameInfo2, 2, clickAction);
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
    }

    protected clickClose(): void {
        this.showCloseMoreGame();
        if (this.closeAction) {
            this.closeAction();
        }
    }

    public bindCloseAction(closeAction: () => void): void {
        this.closeAction = closeAction;
    }
}
