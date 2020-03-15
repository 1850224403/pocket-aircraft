import { BaseConfigContainer } from "./BaseConfigContainer";
import { MapData } from "../data/MapData";
import { Util } from "../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-02 13:51:05 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-02 14:04:27
 */
export class MapConfigContainer extends BaseConfigContainer {

    private _mapMap: Map<number, MapData> = new Map();
    public get mapMap(): Map<number, MapData> {
        return this._mapMap;
    }

    public constructor(callback: Function, caller: any, arg: any) {
        super();
        let loadCallback = (resources) => {
            let config: MapData[] = resources.json;
            for (const map of config) {
                this._mapMap.set(map.id, map);
            }
            callback && callback.call(caller, arg);
        }

        Util.loadRes("config/map", cc.Asset)
            .then(loadCallback)
            .catch(error => console.error(error));
    }

}