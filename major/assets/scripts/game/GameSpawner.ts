import { NodeNameEnum } from "../const/NodeNameEnum";
import { PrefabPathEnum, FramePathEnum } from "../const/ResPathEnum";
import { PoolEnum } from "../const/PoolEnum";
import { Role } from "../entity/role/Role";
import { GameZOrderEnum } from "../const/ZOrderEnum";
import { RoleData } from "../data/RoleData";
import { EnemyData } from "../data/EnemyData";
import { Enemy } from "../entity/Enemy";
import { LogUtil } from "../util/LogUtil";
import { TagEnum } from "../const/TagEnum";
import { Util } from "../util/Util";
import { GroupEnum } from "../const/GroupEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 09:12:43 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-17 06:52:03
 */
export class GameSpawner {

    private _gameRoot: cc.Node = null;

    public constructor() {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            console.error('can not find game root');
            return;
        }
        this._gameRoot = gameRoot;
    }

    public spawnPlayer(pos: cc.Vec2): Role {
        if (!this._gameRoot) return null;
        let resMgr = appContext.resourcesManager;
        let rolePrefab = resMgr.getPrefab(PrefabPathEnum.ROLE);
        if (!rolePrefab) return null;
        let poolMgr = appContext.poolManager;
        let roleNode = poolMgr.get(PoolEnum.ROLE, rolePrefab);
        if (!roleNode) return null;
        roleNode.position = pos;
        roleNode.zIndex = GameZOrderEnum.ROLE;
        this._gameRoot.addChild(roleNode);
        let roleComp = roleNode.getComponent(Role);
        return roleComp;
    }

    public spawnEnemy(enemyData: EnemyData, pos: cc.Vec2): Enemy {
        if (!this._gameRoot) return null;
        let resMgr = appContext.resourcesManager;
        let path = enemyData.type < 10 ? '0' + enemyData.type : enemyData.type;
        let enemyPic = resMgr.getFrame(FramePathEnum.ENEMY + path);
        let enemyNode = new cc.Node('Enemy' + path);
        if (!enemyNode) return;
        let spriteComp = enemyNode.addComponent(cc.Sprite);
        spriteComp.spriteFrame = enemyPic;
        let colliderComp = enemyNode.addComponent(cc.BoxCollider);
        colliderComp.tag = TagEnum.ENEMY;
        enemyNode.position = pos;
        enemyNode.zIndex = GameZOrderEnum.ROLE;
        enemyNode.group = GroupEnum.ENEMY;
        this._gameRoot.addChild(enemyNode);
        let enemyComp = enemyNode.addComponent(Enemy);
        return enemyComp;
    }

    public spawnFireRocket(userX: number, attackerId: number, roadNo: number): void {

    }

    public spawnLandEffect(pos: cc.Vec2, roadY: number): void {
    }

}