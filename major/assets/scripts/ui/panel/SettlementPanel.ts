/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-04 10:41:27 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-22 10:49:40
 */
import { BaseUI } from "../BaseUI";
import { PrefabPathEnum, FramePathEnum } from "../../const/ResPathEnum";
import { HallPanel } from "./HallPanel";
import { GamePanel } from "./GamePanel";
import { CoinsAward } from "../widget/CoinsAward";
import { BannerOrHorizontalBoxHelper } from "../../../gamecommon/Script/GoldenEgg/BannerOrHorizontalBoxHelper";
import { AdManager } from "../../../gamecommon/Script/AdManager/AdManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class SettlementPanel extends BaseUI {

    @property({
        displayName: '金奖杯',
        type: cc.Node,
    })
    private goldTrophy: cc.Node = null;

    @property({
        displayName: '银奖杯',
        type: cc.Node,
    })
    private silverTrophy: cc.Node = null;

    @property({
        displayName: '名次',
        type: cc.Sprite,
    })
    private rankingSprite: cc.Sprite = null;

    @property({
        displayName: '过关按钮',
        type: cc.Node,
    })
    private nextLevel: cc.Node = null;

    @property({
        displayName: '重置按钮',
        type: cc.Node,
    })
    private reset: cc.Node = null;

    @property({
        displayName: '奖励金币',
        type: CoinsAward,
    })
    private coinsAward: CoinsAward = null;

    @property({
        displayName: '按钮',
        type: cc.Node
    })
    private backBtn: cc.Node = null;

    private _rankingNum: number = 0;

    public static url: string = PrefabPathEnum.SETTLEMENT_PANEL;

    public onShow(curRanking: number): void {
        gameContext.gameManager.gamePause();
        this._rankingNum = curRanking;
        this.showTrophy();
        this.showButton();
        this.coinsAward.init(this._rankingNum);
        BannerOrHorizontalBoxHelper.loadAndShow(-350);
        AdManager.loadBannerUpToNode(this.backBtn.height, null, null);

    }

    private showTrophy(): void {
        if (this._rankingNum <= 1) {
            this.goldTrophy.active = true;
            this.silverTrophy.active = false;
            return;
        }
        this.goldTrophy.active = false;
        this.silverTrophy.active = true;
        let resPath = FramePathEnum.TROPHY_RANK_NUM + '0' + this._rankingNum;
        let pic = appContext.resourcesManager.getFrame(resPath);
        if (pic) {
            this.rankingSprite.spriteFrame = pic;
        }
    }

    private showButton(): void {
        if (this._rankingNum <= 1) {
            this.nextLevel.active = true;
            this.reset.active = false;
            return;
        }
        this.reset.active = true;
        this.nextLevel.active = false;
    }

    public passLevel(): void {
        appContext.userDataStorage.passLevel();
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(GamePanel);
    }

    public resetGame(): void {
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(GamePanel);
    }

    public backToHall(): void {
        if (this._rankingNum <= 1) {
            appContext.userDataStorage.passLevel();
        }
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(HallPanel);
    }

    public onHide(): void {
        BannerOrHorizontalBoxHelper.hideBanner();
        this.coinsAward.removeCoins();
    }
}
