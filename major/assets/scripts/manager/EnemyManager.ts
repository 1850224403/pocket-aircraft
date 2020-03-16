import { Enemy } from "../entity/Enemy";
import { AI } from "../entity/ai/AI";
import { EnemyData } from "../data/EnemyData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:52:51 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-16 00:50:19
 */
export class EnemyManager {

    private _enemyList: Set<Enemy> = new Set();

    private _aiList: Set<AI> = new Set();

    public init(): void {
        this._enemyList = new Set();
        this._aiList = new Set();
        let curLevel = appContext.userDataStorage.currentLevel;
        let levelMap = appContext.configManager.getLevelMap();
        let levelData = levelMap.get(curLevel);
        levelData.enemyList && this.createEnemy(levelData.enemyList);
    }

    public updateSelf(dt: number): void {
        this._enemyList.forEach((key, role) => {
            role && role.updateSelf(dt);
        });
        this._aiList.forEach((key, ai) => {
            ai && ai.updateSelf(dt);
        });
    }

    private createEnemy(enemyList: EnemyData[]): void {
        // 创建敌人数据
        for (const enemyData of enemyList) {
            let enemyCount = enemyData.count;
            for (let i = 0; i < enemyCount; i++) {
                let enemy = gameContext.gameSpawner.spawnEnemy(enemyData);
                enemy.bindData(enemyData);
                this._enemyList.add(enemy);
            }
        }
    }

    public clear(): void {
        this._enemyList.clear();
        this._aiList.clear();
    }

}