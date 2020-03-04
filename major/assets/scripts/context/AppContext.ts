import { UIManager } from "../manager/UIManager";
import { UserDataStorage } from "../data/UserDataStorage";
import { PoolManager } from "../manager/PoolManager";
import { ZOrderEnum } from "../const/ZOrderEnum";
import { ResourcesManager } from "../manager/ResourcesManager";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { ConfigManager } from "../manager/ConfigManager";
import { GroupEnum } from "../const/GroupEnum";
import { Util } from "../util/Util";
import { EffectManager } from "../manager/EffectManager";
import { LogUtil } from "../util/LogUtil";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 15:25:19 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-04 00:34:49
 */
const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        appContext: AppContext;
    }
    let appContext: AppContext;
}

@ccclass
export class AppContext extends cc.Component {

    private _userDataStorage: UserDataStorage = null;
    public get userDataStorage(): UserDataStorage {
        return this._userDataStorage;
    }

    private _resourcesManager: ResourcesManager = null;
    public get resourcesManager(): ResourcesManager {
        return this._resourcesManager;
    }

    private _uiManager: UIManager = null;
    public get uiManager(): UIManager {
        return this._uiManager;
    }

    private _poolManager: PoolManager = null;
    public get poolManager(): PoolManager {
        return this._poolManager;
    }

    private _configManager: ConfigManager = null;
    public get configManager(): ConfigManager {
        return this._configManager;
    }

    private _effectManager: EffectManager = null;
    public get effectManager(): EffectManager {
        return this._effectManager;
    }

    public onLoad(): void {
        window.appContext = this;
        cc.game.addPersistRootNode(this.node);

        this._userDataStorage = new UserDataStorage();
        this._resourcesManager = new ResourcesManager();
        this._configManager = new ConfigManager();
    }

    public enterGame(): void {
        this.initNode();

        this._uiManager = new UIManager();
        this._poolManager = new PoolManager();
    }

    private initNode(): void {
        let canvas = cc.Canvas.instance.node;

        let game = new cc.Node(NodeNameEnum.GAME_ROOT);
        game.group = GroupEnum.GAME;
        game.zIndex = ZOrderEnum.GAME;
        // 让游戏节点的位置在屏幕左侧，方便构建地图
        game.x = -canvas.width / 2;

        let ui = new cc.Node(NodeNameEnum.UI_ROOT);
        ui.zIndex = ZOrderEnum.UI;

        canvas.addChild(game);
        canvas.addChild(ui);
        LogUtil.log(canvas.parent.name);

        this._effectManager = Util.createComp(this.node, 'EffectManager', EffectManager);
    }

}