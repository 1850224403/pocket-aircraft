import { NodeNameEnum } from "../const/NodeNameEnum";
import { LogUtil } from "../util/LogUtil";
import { GameStateEnum } from "../const/GameStateEnum";
import { SettlementPanel } from "../ui/panel/SettlementPanel";
import { AudioEnum } from "../const/AudioEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:39:32 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-15 17:19:22
 */
export class GameManager {

    private _state: GameStateEnum = GameStateEnum.IDEL;

    private _lastState: GameStateEnum = null;

    public initGame(): void {
        this._state = GameStateEnum.IDEL;

        // 设置战场关卡数据
        // let battleData = gameContext.battleData;
        // let level = appContext.userDataStorage.currentLevel;
        // let levelMap = appContext.configManager.getLevelMap();
        // if (!levelMap) return;
        // let levelData = levelMap.get(level);
        // if (!levelData) return;
        // battleData.levelData = levelData;

        gameContext.bulletManager.init();
        gameContext.mapManager.init();
        gameContext.roleManager.init();
        gameContext.enemyManager.init();
        gameContext.cameraManager.init();
    }

    public gameIsEnd(): boolean {
        return this._state === GameStateEnum.END;
    }

    public gameReady(): void {
        this._state = GameStateEnum.READY;
    }

    public gamePause(): void {
        this._lastState = this._state;
        this._state = GameStateEnum.PAUSE;
    }

    public gameResume(): void {
        if (this._state !== GameStateEnum.PAUSE) return;
        this._state = this._lastState;
        this._lastState = null;
    }

    public startGame(): void {
        this._state = GameStateEnum.PLAY;
    }

    public updateSelf(dt: number): void {
        switch (this._state) {
            case GameStateEnum.IDEL:
                gameContext.enemyManager.updateSelf(dt);
                break;

            case GameStateEnum.READY:
                gameContext.enemyManager.updateSelf(dt);

                break;

            case GameStateEnum.PAUSE:

                break;

            case GameStateEnum.PLAY:
                gameContext.mapManager.updateSelf(dt);
                gameContext.roleManager.updateSelf(dt);
                gameContext.enemyManager.updateSelf(dt);
                break;

            case GameStateEnum.END:
                gameContext.roleManager.updateSelf(dt);
                break;

            default:
                break;
        }
    }

    public lateUpdateSelf(): void {
        switch (this._state) {
            case GameStateEnum.IDEL:
                break;

            case GameStateEnum.READY:
                break;

            case GameStateEnum.PLAY:
                gameContext.cameraManager.lateUpdateSelf();
                break;

            case GameStateEnum.PAUSE:

                break;

            case GameStateEnum.END:
                break;

            default:
                break;
        }
    }

    public gameOver(win: boolean): void {
        this._state = GameStateEnum.END;
        appContext.uiManager.showUI(SettlementPanel, null, win);
    }

    public clearBattleField(): void {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }
        gameRoot.destroyAllChildren();
        gameContext.roleManager.clear();
        gameContext.cameraManager.clear();
    }

    public restart(): void {
        this.clearBattleField();
        //this.initGame();
    }

}
