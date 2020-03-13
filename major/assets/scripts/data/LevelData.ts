import { AIConfigData } from "./AIConfigData";
import { EnemyData } from "./EnemyData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-04 13:51:25 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-14 15:12:56
 */
export class LevelData {

    /** 编号 */
    public id: number = 0;

    /** 圈数 */
    public roundCount: number = 0;

    /**敌人 */
    public enemyList: EnemyData[] = [];

    /** ai配置数据 */
    public aiConfig: AIConfigData = null;

}