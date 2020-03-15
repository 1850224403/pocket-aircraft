import { BaseUI } from "../BaseUI";
import { PrefabPathEnum } from "../../const/ResPathEnum";
import { HallPanel } from "./HallPanel";
import { BannerOrHorizontalBoxHelper } from "../../../gamecommon/Script/GoldenEgg/BannerOrHorizontalBoxHelper";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-11 14:14:00 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 15:21:33
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GaragePanel extends BaseUI {

    public static url: string = PrefabPathEnum.GARAGE_PANEL;

    public onShow(...args: any): void {
    }

    public onHide(): void {
        let player = gameContext.roleManager.player;
        player && player.checkChangeSkin();
    }

    private clickBackHall(): void {
        appContext.uiManager.showUI(HallPanel);
    }

}
