import { BattleData } from "../data/BattleData";
import { GameManager } from "../manager/GameManager";
import { MapManager } from "../manager/MapManager";
import { RoleManager } from "../manager/RoleManager";
import { GameSpawner } from "../game/GameSpawner";
import { CameraManager } from "../manager/CameraManager";
import { HallPanel } from "../ui/panel/HallPanel";
import { ShockManager } from "../manager/ShockManager";
import { BulletManager } from "../manager/BulletManager";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        gameContext: GameContext;
    }
    let gameContext: GameContext;
}

@ccclass
export class GameContext extends cc.Component {

    private _battleData: BattleData = null;
    public get battleData(): BattleData {
        return this._battleData;
    }

    private _gameManager: GameManager = null;
    public get gameManager(): GameManager {
        return this._gameManager;
    }

    private _mapManager: MapManager = null;
    public get mapManager(): MapManager {
        return this._mapManager;
    }

    private _roleManager: RoleManager = null;
    public get roleManager(): RoleManager {
        return this._roleManager;
    }

    private _gameSpawner: GameSpawner = null;
    public get gameSpawner(): GameSpawner {
        return this._gameSpawner;
    }

    private _cameraManager: CameraManager = null;
    public get cameraManager(): CameraManager {
        return this._cameraManager;
    }

    private _shockManager: ShockManager = null;
    public get shockManager(): ShockManager {
        return this._shockManager;
    }

    private _bulletManager: BulletManager = null;
    public get bulletManager(): BulletManager {
        return this._bulletManager;
    }

    public onLoad(): void {
        window.gameContext = this;
        cc.director.getCollisionManager().enabled = true;
        appContext.enterGame();

        this._battleData = new BattleData();
        this._gameManager = new GameManager();
        // 
        // 
        this._gameSpawner = new GameSpawner();
        this._cameraManager = new CameraManager()
        // this._shockManager = new ShockManager();
        this._mapManager = new MapManager();
        this._roleManager = new RoleManager();
        this._bulletManager = new BulletManager();
        appContext.uiManager.showUI(HallPanel);
    }

    public init(): void {
        this._mapManager.init();
    }

    public update(dt: number): void {
        if (dt > 0.05) dt = 0.02;
        this._gameManager.updateSelf(dt);
    }

    public lateUpdate(): void {
        //this._gameManager.lateUpdateSelf();
    }

}