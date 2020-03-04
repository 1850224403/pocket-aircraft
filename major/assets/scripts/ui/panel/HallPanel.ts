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

    private _timer: number = 0;

    public static url: string = PrefabPathEnum.HALL_PANEL;

    public start(): void {
        //gameContext.gameManager.initGame();
        this._timer = 20;
    }

    public onShow(...args: any): void {
    }

    public update(dt: number): void {
    }

    private clickStartGame(): void {
        appContext.uiManager.showUI(GamePanel);
    }

    public onHide(): void {
    }

}