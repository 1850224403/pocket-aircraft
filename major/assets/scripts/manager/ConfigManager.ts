import { BaseConfigContainer, ConfigContainerClass } from "../config/BaseConfigContainer";
import { MapConfigContainer } from "../config/MapConfigContainer";
import { MapData } from "../data/MapData";
import { LevelConfigContainer } from "../config/LevelConfigContainer";
import { LevelData } from "../data/LevelData";

/*
 * @Author: Feifan Chen 
 * @Date: 2019-11-11 18:50:09 
 * @Description: 配置管理 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-04 14:01:50
 */
export class ConfigManager {

    private curLoadedCount: number = 0;

    private configContainerList: BaseConfigContainer[] = [];

    public loadAllConfig(callback?: Function): void {
        this.loadConfig(MapConfigContainer, this.callback, callback);
        this.loadConfig(LevelConfigContainer, this.callback, callback);
    }

    private callback(callback: Function): void {
        this.curLoadedCount++;
        if (this.configContainerList.length === this.curLoadedCount) {
            callback && callback();
        }
    }

    public loadConfig<T extends BaseConfigContainer>(configClass: ConfigContainerClass<T>, callback: Function, arg: any): void {
        let config = new configClass(callback, this, arg);
        config.tag = configClass;
        this.configContainerList.push(config);
    }

    public getConfig<T extends BaseConfigContainer>(configClass: ConfigContainerClass<T>): BaseConfigContainer {
        for (let i = 0; i < this.configContainerList.length; i++) {
            if (this.configContainerList[i].tag === configClass) {
                return this.configContainerList[i];
            }
        }
        return null;
    }

    public getMapMap(): Map<number, MapData> {
        let mapConfig = this.getConfig(MapConfigContainer) as MapConfigContainer;
        if (!mapConfig) return null;
        return mapConfig.mapMap;
    }

    public getLevelMap(): Map<number, LevelData> {
        let levelConfig = this.getConfig(LevelConfigContainer) as LevelConfigContainer;
        if (!levelConfig) return null;
        return levelConfig.levelMap;
    }

}