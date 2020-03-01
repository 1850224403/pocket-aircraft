import { PrefabPathEnum } from "../../const/ResPathEnum";
import { PoolEnum } from "../../const/PoolEnum";
import { MapProgressArrow } from "./MapProgressArrow";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-04 10:58:41 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-10 19:34:20
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class MapProgress extends cc.Component {

    @property({
        displayName: '玩家位置箭头',
        type: MapProgressArrow
    })
    private playArrow: MapProgressArrow = null;

    @property({
        displayName: '效果',
        type: cc.Node
    })
    private effect: cc.Node = null;

    @property({
        displayName: '箭头层',
        type: cc.Node
    })
    private arrowLayer: cc.Node = null;

    private readonly _startX: number = 5;

    private readonly _endX: number = 265;

    public onLoad(): void {
        this.createMapEffect();
        this.createEnemyArrow();
        this.playArrow.bindData(1, this._startX, this._endX);
    }

    public init(): void {
        let roleArrows = this.arrowLayer.children;
        for (let roleArrow of roleArrows) {
            let roleArrowComp = roleArrow.getComponent(MapProgressArrow);
            roleArrowComp && roleArrowComp.init();
        }
    }

    public createEnemyArrow(): void {
        let arrowPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.ENEMY_ARROW);
        if (!arrowPrefab) return;
        for (let i = 2; i < 6; i++) {
            let enemyArrowNode = cc.instantiate(arrowPrefab);
            if (enemyArrowNode == null) break;
            this.arrowLayer.addChild(enemyArrowNode);
            let enemy = gameContext.roleManager.getRoleByID(i);
            if (enemy && enemy.data) {
                let mapArrowComp = enemyArrowNode.getComponent(MapProgressArrow);
                mapArrowComp && mapArrowComp.bindData(enemy.data.id, this._startX, this._endX);
            }
        }
    }

    private createMapEffect(): void {
        let mapEffectPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.MAP_PROGRESS_EFFECT);
        if (!mapEffectPrefab) return;
        for (let i = 0; i < 6; i++) {
            let mapEffectNode = appContext.poolManager.get(PoolEnum.MAP_PROGRESS, mapEffectPrefab);
            mapEffectNode.position = cc.v2(-60 + 60 * i, 0);
            mapEffectNode.parent = this.effect;
        }
    }
}
