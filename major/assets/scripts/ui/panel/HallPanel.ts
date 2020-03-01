import { BaseUI } from "../BaseUI";
import { PrefabPathEnum, FramePathEnum } from "../../const/ResPathEnum";
import { GamePanel } from "./GamePanel";
import { GaragePanel } from "./GaragePanel";
import { EffectEnum } from "../../const/EffectEnum";
import { SettingDialog } from "../dialog/SettingDialog";
import { BannerOrHorizontalBoxHelper } from "../../../gamecommon/Script/GoldenEgg/BannerOrHorizontalBoxHelper";
import { WorldEventManager } from "../../../gamecommon/Script/GameCommon/WorldEventManager";
import { EventEnum } from "../../const/EventEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 10:25:46 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 16:42:37
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class HallPanel extends BaseUI {

    @property({
        displayName: '导出banner层',
        type: cc.Node
    })
    private bannerLayer: cc.Node = null;

    private _timer: number = 0;

    public static url: string = PrefabPathEnum.HALL_PANEL;

    public start(): void {
        gameContext.gameManager.initGame();
        this._timer = 20;
        BannerOrHorizontalBoxHelper.hideBanner();
        WorldEventManager.addListener(EventEnum.DISPLAY_BANNER_LAYER, this.displayBannerLayer, this);
    }

    public onShow(...args: any): void {
    }

    private showBarrage(): void {
        let y = Math.random() * 300 + 500;
        appContext.effectManager.showEffect(EffectEnum.BARRAGE, cc.v2(900, y));
    }

    private displayBannerLayer(): void {
        this.bannerLayer.active = true;
    }

    public update(dt: number): void {
        this._timer -= dt;
        if (this._timer < 0) {
            this.showBarrage();
            this._timer = 20;
        }
    }

    private clickStartGame(): void {
        appContext.uiManager.showUI(GamePanel);
    }

    private showSettingDialog(): void {
        this.bannerLayer.active = false;
        appContext.uiManager.showUI(SettingDialog);
    }

    private clickGarageButton(): void {
        appContext.uiManager.showUI(GaragePanel);
    }

    public onHide(): void {
        appContext.effectManager.initBarrage();
    }

}