import { MapBuilder } from "../builder/MapBuilder";
import { LogUtil } from "../util/LogUtil";
import { MapData } from "../data/MapData";
import { BackgroundContainer } from "../Container/BackgroundContainer";
import { GameZOrderEnum } from "../const/ZOrderEnum";
import { NodeNameEnum } from "../const/NodeNameEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:36:30 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-16 00:46:32
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class MapManager {

    private _data: MapData = null;

    private _backgroundContainer: BackgroundContainer = null;
    public get backgroundContainer(): BackgroundContainer {
        return this._backgroundContainer;
    }

    public init(): void {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }

        let currentLevel = appContext.userDataStorage.currentLevel;
        let id = currentLevel;
        let mapMap = appContext.configManager.getMapMap();
        if (!mapMap) return;
        let mapData = mapMap.get(id);
        if (!mapData) {
            LogUtil.err('no map data with id ', id);
            return;
        }
        this._data = mapData;

        let backgroundContainerNode = new cc.Node('BackgroundContainer');
        let backgroundContainer = backgroundContainerNode.addComponent(BackgroundContainer);
        backgroundContainerNode.zIndex = GameZOrderEnum.BACKGROUND;

        gameRoot.addChild(backgroundContainerNode);

        this._backgroundContainer = backgroundContainer;

        this._backgroundContainer.bindData(this._data);

        this._backgroundContainer.build();
    }

    public updateSelf(dt: number): void {
        this._backgroundContainer && this._backgroundContainer.updateSelf(dt);
    }

}