import { MapBuilder } from "../builder/MapBuilder";
import { LogUtil } from "../util/LogUtil";
import { MapData } from "../data/MapData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:36:30 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-04 00:19:33
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class MapManager {

    private _data: MapData = null;

    private _roundCount: number = 1;

    private _mapBuilder: MapBuilder = new MapBuilder();

    public init(): void {
        let currentLevel = appContext.userDataStorage.currentLevel;
        let a = Math.ceil(currentLevel / 3);
        let id = a;
        let mapMap = appContext.configManager.getMapMap();
        if (!mapMap) return;
        let mapData = mapMap.get(id);
        if (!mapData) {
            LogUtil.err('no map data with id ', id);
            return;
        }
        this._data = mapData;
        this._mapBuilder.build(mapData);
    }

    public updateSelf(dt: number): void {
        // ...
    }

}