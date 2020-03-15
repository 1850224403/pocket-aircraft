import { ShareManager } from "../ShareCommon/ShareManager";
import { BannerOrHorizontalBoxHelper } from "./BannerOrHorizontalBoxHelper";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { AdManager } from "../AdManager/AdManager";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { TipManager } from "../Tip/TipManager";
import { ShareAdHelper } from "../ShareAdHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export class HitGoldenEgg extends cc.Component {
    @property(cc.Sprite)
    protected progressBar: cc.Sprite = null;

    @property(cc.Node)
    protected hitEggNode: cc.Node = null;

    @property(cc.Node)
    protected receiveNode: cc.Node = null;

    @property(cc.Node)
    private bannerNode: cc.Node = null;

    @property(cc.Label)
    private coinLabel: cc.Label = null;

    @property(cc.Node)
    private harmmerNode: cc.Node = null;

    @property(cc.Node)
    private closeBtn: cc.Node = null;

    @property(cc.Node)
    private eggNode: cc.Node = null;

    @property(cc.Prefab)
    private boomEffect: cc.Prefab = null;

    protected progress: number = 0;

    protected isOpenEgg = false;

    protected coinNum: number = 100;

    private closeBtnShowTimer: number = 0;

    protected successCallback: (coinNum: number) => void = null;

    protected closeCallBack: () => void = null;

    protected maxProgress: number = 1;

    public bindData(coinNum: number, successCallBack: (coinNum: number) => void, closeCallBack: () => void): void {
        this.successCallback = successCallBack;
        this.closeCallBack = closeCallBack;
        this.coinNum = coinNum;
        this.init();
    }

    public init(): void {
        this.maxProgress = Math.random() * 0.6 + 0.35;
        this.progress = 0;
        this.progressBar.fillRange = 0;
        this.isOpenEgg = false;
        this.hitEggNode.active = true;
        this.receiveNode.active = false;
        this.coinLabel.string = this.coinNum + "";
        BannerOrHorizontalBoxHelper.hideBanner();
        BannerOrHorizontalBoxHelper.loadBanner(this.bannerNode.y);
        this.closeBtn.active = false;
        this.closeBtnShowTimer = 0;
        StatisticsManager.thirdSendEvent("进入砸金蛋界面");
    }

    public update(dt: number): void {
        if (this.progress >= this.maxProgress && !this.isOpenEgg) {
            this.progressBar.fillRange = this.progress;
            this.isOpenEgg = true;
            StatisticsManager.thirdSendEvent("砸金蛋成功");
            BannerOrHorizontalBoxHelper.showBanner(this.bannerNode.y);
            this.scheduleOnce(() => {
                this.hitEggNode.active = false;
                this.receiveNode.active = true;
            }, Math.random() * 0.15 + 0.2);
            return;
        }
        if (this.progress > 0) {
            this.progress -= 0.005;
        }
        this.progressBar.fillRange = this.progress;
        //延时显示关闭按钮
        if (!this.closeBtn.activeInHierarchy) {
            this.closeBtnShowTimer += dt;
            if (this.closeBtnShowTimer >= ShareManager.eggDialogCloseBtnWaitTime) {
                this.closeBtn.active = true;
                this.closeBtnShowTimer = 0;
            }
        }
        //预防其他界面打开banner
        if (!this.isOpenEgg) {
            if (AdManager.bannerAdShow) {
                BannerOrHorizontalBoxHelper.hideBanner();
            }
        }
    }

    private lastHitTime: number = 0;

    protected openBtnClick(): void {
        this.progress += 0.15;
        let delTime = (Date.now() - this.lastHitTime);
        if (delTime >= 1000) {
            this.playHitAnim(1);
        }
        else {
            this.playHitAnim(Math.max(1000 / delTime, 2));
        }
        this.lastHitTime = Date.now();
    }

    private playHitAnim(hitTime: number): void {
        this.scheduleOnce(() => {
            GameCommonPool.requestInstantWithArgs(this.boomEffect, cc.v2(28, 94), 0, this.eggNode);
        }, 0.2 / hitTime);

        let hit = cc.rotateTo(0.2, -30);
        let back = cc.rotateTo(0.2, 0);
        let action = cc.sequence(hit, back);
        let finnalAction = cc.speed(action, hitTime);
        this.harmmerNode.runAction(finnalAction);
    }

    protected receiveBtnClick(): void {
        this.successCallback && this.successCallback(this.coinNum);
        TipManager.showTip("您已获得奖励金币X" + this.coinNum);
    }

    protected doubleReceiveBtnClick(): void {
        let self = this;
        ShareAdHelper.AdFirst('砸金蛋双倍领取', () => {
            let coins = this.coinNum * 2;
            TipManager.showTip("您已获得奖励金币X" + coins);
            self.successCallback && self.successCallback(coins);
        });
    }

    protected close(): void {
        this.closeCallBack && this.closeCallBack();
    }
}
