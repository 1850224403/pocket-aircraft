import { MapData } from "../data/MapData";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-03-05 23:45:09 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-06 00:11:56
 */

export interface IContainer {

    bindData(mapData: MapData): void;

    build(): void;

    updateSelf(dt: number): void;

}