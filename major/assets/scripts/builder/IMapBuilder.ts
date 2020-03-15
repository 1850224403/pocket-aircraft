import { MapData } from "../data/MapData";
import { SlopeData } from "../data/SlopeData";
import { ItemData } from "../data/ItemData";
import { RoadBlockData } from "../data/RoadBlockData";
import { SundriesData } from "../data/SundriesData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 14:08:40 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-04 00:18:33
 */
export interface IMapBuilder {

    /**
     * 构建地图
     * @param data 地图数据
     */
    build(data: MapData): void;

    /**
     * 构建背景
     */
    buildBackground(roadLength: number, id: number): void;

}