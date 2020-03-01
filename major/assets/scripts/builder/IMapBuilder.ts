import { MapData } from "../data/MapData";
import { SlopeData } from "../data/SlopeData";
import { ItemData } from "../data/ItemData";
import { RoadBlockData } from "../data/RoadBlockData";
import { SundriesData } from "../data/SundriesData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 14:08:40 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-10 14:58:20
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
    buildBackground(roadLength: number, roundCount: number): void;

    /**
     * 构建路两边的杂物
     */
    buildSundries(sundriesList: SundriesData[], roadLength: number, roundCount: number): void;

    /**
     * 构建起点位置
     */
    buildStartPos(): void;

    /**
     * 构建道路
     */
    buildSlope(slopeList: SlopeData[], roadLength: number, roundCount: number): void;

    /**
     * 构建路障
     */
    buildRoadBlock(roadBlockList: RoadBlockData[], roadLength: number, roundCount: number): void;

    /**
     * 构建道具
     */
    buildItems(itemList: ItemData[], roadLength: number, roundCount: number): void;

}