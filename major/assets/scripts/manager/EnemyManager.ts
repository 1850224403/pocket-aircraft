import { Enemy } from "../entity/Enemy";
import { AI } from "../entity/ai/AI";
import { EnemyData } from "../data/EnemyData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:52:51 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-17 07:16:23
 */
export class EnemyManager {

    private _enemyList: Set<Enemy> = new Set();

    private _enemyDataList: EnemyData[] = [];

    private _aiList: Set<AI> = new Set();

    private _timer: number = 0;

    public init(): void {
        this._enemyList = new Set();
        this._aiList = new Set();
        let curLevel = appContext.userDataStorage.currentLevel;
        let levelMap = appContext.configManager.getLevelMap();
        let levelData = levelMap.get(curLevel);
        if (!levelData.enemyList) return;
        this._enemyDataList = levelData.enemyList;
        //levelData.enemyList && this.createEnemy(levelData.enemyList);
    }

    public updateSelf(dt: number): void {
        this._enemyList.forEach((key, role) => {
            role && role.updateSelf(dt);
        });
        this._aiList.forEach((key, ai) => {
            ai && ai.updateSelf(dt);
        });

        this._timer += dt;
        if (this._timer >= 1) {
            let data = this._enemyDataList.shift();
            data && this.createEnemy(data);
        }
    }

    private createEnemy(enemyData: EnemyData): void {
        // 创建敌人数据
        let enemyCount = enemyData.count;
        let pos = cc.v2(0, 0);
        switch (enemyData.moveWay) {
            case 0:
                pos = cc.v2(-400, 300);
                for (let i = 0; i < enemyCount; i++) {
                    let enemy = gameContext.gameSpawner.spawnEnemy(enemyData, pos);
                    enemy.bindData(enemyData);
                    this._enemyList.add(enemy);
                    pos.x -= 80;
                    if (pos.x < -720) {
                        pos.y += 100;
                        pos.x = -400;
                    }
                }
                break;
        }
    }


    public clear(): void {
        this._enemyList.clear();
        this._aiList.clear();
    }

}