import { SlopeData } from "./SlopeData";
import { ItemData } from "./ItemData";
import { RoadBlockData } from "./RoadBlockData";
import { SundriesData } from "./SundriesData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 14:16:13 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-14 15:20:12
 */
export class MapData {

    /** 编号 */
    public id: number = 0;

    /** 道路长度 */
    public roadLength: number = 0;

    /** 坡列表 */
    public slopeList: SlopeData[] = [];

    /** 道具列表 */
    public itemList: ItemData[] = [];

    /** 道路障碍物列表 */
    public roadBlockList: RoadBlockData[] = [];

    /** 路两旁杂物列表 */
    public sundriesList: SundriesData[] = [];

}