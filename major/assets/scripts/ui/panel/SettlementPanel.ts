import { BaseUI } from "../BaseUI";
import { PrefabPathEnum, FramePathEnum } from "../../const/ResPathEnum";
import { HallPanel } from "./HallPanel";
import { GamePanel } from "./GamePanel";
/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-04 10:41:27 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-15 17:06:00
 */

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

    private _isWin: boolean = false;

    public static url: string = PrefabPathEnum.SETTLEMENT_PANEL;

    public onShow(win: boolean): void {
        gameContext.gameManager.gamePause();
        this._isWin = win;
    }

    public passLevel(): void {
        appContext.userDataStorage.passLevel();
        gameContext.gameManager.restart();
        appContext.uiManager.showUI(GamePanel);
    }

    public refreshBtn(): void {
        this.nextLevel.active = this._isWin;
        this.reset.active = !this._isWin;
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
