import { BaseUI } from "../BaseUI";
import { PrefabPathEnum } from "../../const/ResPathEnum";
import { HallPanel } from "./HallPanel";
import { CountDown } from "../widget/CountDown";
import { MapProgress } from "../widget/MapProgress";
import { InputHandler } from "../../game/InputHandler";
import { PoolEnum } from "../../const/PoolEnum";
import { WorldEventManager } from "../../../gamecommon/Script/GameCommon/WorldEventManager";
import { Coin } from "../../entity/Coin";
import { EventEnum } from "../../const/EventEnum";
import { GameCounterUI } from "../widget/GameCounterUI";
import { SettingDialog } from "../dialog/SettingDialog";
import { BannerOrHorizontalBoxHelper } from "../../../gamecommon/Script/GoldenEgg/BannerOrHorizontalBoxHelper";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 14:26:22 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 16:18:08
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GamePanel extends BaseUI {

    @property({
        displayName: '倒计时',
        type: CountDown,
    })
    private countDown: CountDown = null;

    @property({
        displayName: '点击层',
        type: InputHandler,
    })
    private inputHandler: InputHandler = null;

    @property({
        displayName: '总金币',
        type: cc.Node,
    })
    private totalCoins: cc.Node = null;

    @property({
        displayName: '金币层',
        type: cc.Node,
    })
    private coinsLayer: cc.Node = null;

    @property({
        displayName: '进度条',
        type: MapProgress,
    })
    private mapProgress: MapProgress = null;

    @property({
        displayName: '游戏计数器',
        type: GameCounterUI
    })
    private gameCounterUI: GameCounterUI = null;

    @property({
        displayName: '导出banner层',
        type: cc.Node
    })
    private bannerLayer: cc.Node = null;

    public static url: string = PrefabPathEnum.GAME_PANEL;

    public onShow(): void {
        WorldEventManager.addListener(EventEnum.CREATE_COIN, this.createCoin, this);
        WorldEventManager.addListener(EventEnum.DISPLAY_BANNER_LAYER, this.displayBannerLayer, this);
        this.init();
    }

    private displayBannerLayer(): void {
        this.bannerLayer.active = true;
    }

    private init(): void {
        gameContext.gameManager.gameReady();
        let callback = () => {
            let player = gameContext.roleManager.player;
            this.inputHandler.bindPlayer(player);
            gameContext.gameManager.startGame();
        }
        this.countDown.init(callback);
        this.mapProgress.init();
        this.gameCounterUI.init();
        this.displayBannerLayer();
    }

    public onHide(): void {
        WorldEventManager.removeListener(EventEnum.CREATE_COIN, this.createCoin, this);
    }

    public backToHall(): void {
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(HallPanel);
    }

    public resetGame(): void {
        gameContext.gameManager.restart();
        this.init();
    }

    public showSettingDialog(): void {
        this.bannerLayer.active = false;
        appContext.uiManager.showUI(SettingDialog);
    }

    public createCoin(coinPos: cc.Vec2): void {
        let coinPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.COIN);
        if (!coinPrefab) return;
        let coinNode = appContext.poolManager.get(PoolEnum.COIN, coinPrefab);
        if (!coinNode) return;
        let coin = coinNode.getComponent(Coin);
        if (!coin) return;
        coinNode.parent = this.coinsLayer;
        coinNode.position = coinPos;
        coin.init(this.totalCoins.position, 1000);
    }
}