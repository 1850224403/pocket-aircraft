import { BaseUI } from "../BaseUI";
import { PrefabPathEnum } from "../../const/ResPathEnum";
import { HallPanel } from "../panel/HallPanel";
import { BannerOrHorizontalBoxHelper } from "../../../gamecommon/Script/GoldenEgg/BannerOrHorizontalBoxHelper";
import { WorldEventManager } from "../../../gamecommon/Script/GameCommon/WorldEventManager";
import { EventEnum } from "../../const/EventEnum";
import { GameConfig } from "../../../gamecommon/Script/GameCommon/GameCommon";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-15 16:59:40 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 16:24:07
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class SettingDialog extends BaseUI {

    @property({
        displayName: '版本号',
        type: cc.Label,
    })
    private version: cc.Label = null;

    public static url: string = PrefabPathEnum.SETTING_DIALOG;

    public start(): void {
        this.version.string = GameConfig.versionCode;
    }

    public onShow(): void {
        BannerOrHorizontalBoxHelper.loadAndShow(-150);
        gameContext.gameManager.gamePause();
    }

    public onHide(): void {
        BannerOrHorizontalBoxHelper.hideBanner();
        WorldEventManager.triggerEvent(EventEnum.DISPLAY_BANNER_LAYER, null);
        gameContext.gameManager.gameResume();
    }

    private backToHall(): void {
        appContext.uiManager.hideUI(SettingDialog);
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(HallPanel);
    }

    private closeHall(): void {
        appContext.uiManager.hideUI(SettingDialog);
    }
}