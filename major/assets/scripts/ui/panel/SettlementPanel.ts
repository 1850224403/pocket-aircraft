/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-04 10:41:27 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-12 00:22:15
 */
import { BaseUI } from "../BaseUI";
import { PrefabPathEnum, FramePathEnum } from "../../const/ResPathEnum";
import { HallPanel } from "./HallPanel";
import { GamePanel } from "./GamePanel";
import { CoinsAward } from "../widget/CoinsAward";
const { ccclass, property } = cc._decorator;

@ccclass
export class SettlementPanel extends BaseUI {

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
        displayName: '返回按钮',
        type: cc.Node
    })
    private backBtn: cc.Node = null;


    public static url: string = PrefabPathEnum.SETTLEMENT_PANEL;

    public onShow(curRanking: number): void {
        gameContext.gameManager.gamePause();
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
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(HallPanel);
    }

    public onHide(): void {
    }
}
