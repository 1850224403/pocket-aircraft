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
 * @Last Modified time: 2020-03-04 00:46:39
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GamePanel extends BaseUI {


    public static url: string = PrefabPathEnum.GAME_PANEL;

    public onShow(): void {
        //gameContext.init();
        gameContext.gameManager.initGame();
        this.init();
    }


    private init(): void {
        gameContext.gameManager.gameReady();
        let callback = () => {
            gameContext.gameManager.startGame();
        }
    }

    public onHide(): void {
    }
}