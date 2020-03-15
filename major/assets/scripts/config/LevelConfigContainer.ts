import { BaseConfigContainer } from "./BaseConfigContainer";
import { Util } from "../util/Util";
import { LevelData } from "../data/LevelData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-02 13:51:05 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-04 13:55:07
 */
export class LevelConfigContainer extends BaseConfigContainer {

    private _levelMap: Map<number, LevelData> = new Map();
    public get levelMap(): Map<number, LevelData> {
        return this._levelMap;
    }

    public constructor(callback: Function, caller: any, arg: any) {
        super();
        let loadCallback = (resources) => {
            let config: LevelData[] = resources.json;
            for (const level of config) {
                this._levelMap.set(level.id, level);
            }
            callback && callback.call(caller, arg);
        }

        Util.loadRes("config/level", cc.Asset)
            .then(loadCallback)
            .catch(error => console.error(error));
    }

}