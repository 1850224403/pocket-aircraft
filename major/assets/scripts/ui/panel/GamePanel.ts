import { BaseUI } from "../BaseUI";
import { PrefabPathEnum } from "../../const/ResPathEnum";
import { InputHandler } from "../../game/InputHandler";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 14:26:22 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-05 00:58:54
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class GamePanel extends BaseUI {

    @property({
        displayName: '输入层',
        type: InputHandler
    })
    private inputHandler: InputHandler = null;

    public static url: string = PrefabPathEnum.GAME_PANEL;

    public onShow(): void {
        //gameContext.init();
        gameContext.gameManager.initGame();
        this.init();
    }


    private init(): void {
        //gameContext.gameManager.gameReady();

        //let callback = () => {
        gameContext.gameManager.startGame();
        //}

        let player = gameContext.roleManager.player;
        this.inputHandler.bindPlayer(player);
    }

    public onHide(): void {
    }
}