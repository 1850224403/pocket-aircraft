import { MoreGameManager, MoreGameInfo } from "./MoreGameManager";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { HorizontaBoxItem } from "./HorizontaBoxItem";
import { ShareManager } from "../ShareCommon/ShareManager";
import { UserData, ExportTypeEnum } from "../GameCommon/UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export class HorizontaGameBox extends cc.Component {

    @property(cc.Prefab)
    private gameItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    private layout: cc.Node = null;

    private init: boolean = false;

    private itemArrays: Array<cc.Node> = new Array();

    private moreGameInfos: Array<MoreGameInfo> = null;

    private moveDistance: number = 0;

    private moveSpeed: number = 35;

    private touchPoint: cc.Vec2 = null;

    private currentGender: number = null;

    onEnable(): void {
        if (!ShareManager.getHorizontalControl()) {
            this.node.active = false;
            return;
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        UserData.addModuleShows(ExportTypeEnum.HORIZONTA_GAME_BOX, 1);
    }

    onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    update(dt: number): void {
        if (!this.init) {
            this.initMoreGameInfo();
        } else {

            // 检测到是男性用户时,需要显示男性游戏
            if (this.currentGender != UserData.data.gender && UserData.data.gender == 1) {
                this.initBodyMoreGameInfo();
                this.currentGender = UserData.data.gender;
            }

            this.move(dt);
        }
    }

    private touchStart(event: cc.Event.EventTouch): void {
        if (event == null) {
            return;
        }

        this.touchPoint = event.getLocation();
    }

    private touchMove(event: cc.Event.EventTouch): void {
        if (event == null) {
            return;
        }

        let touchPoint = event.getLocation();
        if (touchPoint == null) {
            return;
        }
        if (this.touchPoint == null) {
            this.touchPoint = touchPoint;
            return;
        }
        let distance = this.touchPoint.x - touchPoint.x;
        this.touchPoint = touchPoint;
        this.moveByScroll(distance);
    }

    private touchEnd(event: cc.Event.EventTouch): void {
        if (event == null) {
            return;
        }
        this.touchMove(event);
        this.touchPoint = null;
    }

    private initMoreGameInfo(): void {
        let moreGameInfos = MoreGameManager.getHorizontalMoreGameInfo();

        if (moreGameInfos == null || moreGameInfos.length == 0) {
            return;
        }

        this.moreGameInfos = moreGameInfos;

        this.init = true;

        let x = -250;

        moreGameInfos.forEach((moreGameInfo) => {
            if (moreGameInfo == null || moreGameInfo.boyGame) {
                return;
            }

            let moreGameItem = GameCommonPool.requestInstant(this.gameItemPrefab);
            if (moreGameItem == null) {
                return;
            }

            moreGameItem.setParent(this.layout);
            moreGameItem.x = x;
            x += 120;

            this.itemArrays.push(moreGameItem);

            let moreGameItemCmp = moreGameItem.getComponent(HorizontaBoxItem);
            if (moreGameItemCmp == null) {
                return;
            }

            moreGameItemCmp.bindData(moreGameInfo);
        });
    }

    private initBodyMoreGameInfo(): void {
        if (this.moreGameInfos == null || this.moreGameInfos.length == 0) {
            return;
        }

        let lastItem = this.itemArrays.length == 0 ? null : this.itemArrays[this.itemArrays.length - 1];
        let x = lastItem == null ? -250 : (lastItem.x + 120);

        this.moreGameInfos.forEach((moreGameInfo) => {
            if (moreGameInfo == null || !moreGameInfo.boyGame) {
                return;
            }

            let moreGameItem = GameCommonPool.requestInstant(this.gameItemPrefab);
            if (moreGameItem == null) {
                return;
            }

            moreGameItem.setParent(this.layout);
            moreGameItem.x = x;
            x += 120;

            this.itemArrays.push(moreGameItem);

            let moreGameItemCmp = moreGameItem.getComponent(HorizontaBoxItem);
            if (moreGameItemCmp == null) {
                return;
            }

            moreGameItemCmp.bindData(moreGameInfo);
        });
    }

    private move(dt: number): void {
        if (!this.init || this.touchPoint != null) {
            return;
        }

        if (this.itemArrays == null || this.itemArrays.length == 0) {
            return;
        }

        let distance = dt * this.moveSpeed
        this.moveDistance += distance;

        this.itemArrays.forEach((item) => {
            item.x -= distance;
        });

        if (this.moveDistance >= 120) {
            this.moveDistance -= 120;
            let first = this.itemArrays.shift();
            this.itemArrays.push(first);
            first.x += 120 * this.itemArrays.length;
        }
    }

    private moveByScroll(distance: number): void {
        if (!this.init) {
            return;
        }

        this.moveDistance += distance;

        this.itemArrays.forEach((item) => {
            item.x -= distance;
        });

        if (this.moveDistance >= 120) {
            this.moveDistance -= 120;
            let first = this.itemArrays.shift();
            this.itemArrays.push(first);
            first.x += 120 * this.itemArrays.length;
        }
    }
}
