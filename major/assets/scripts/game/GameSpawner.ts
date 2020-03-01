import { NodeNameEnum } from "../const/NodeNameEnum";
import { PrefabPathEnum } from "../const/ResPathEnum";
import { PoolEnum } from "../const/PoolEnum";
import { FireRocket } from "../entity/FireRocket";
import { GameEntityZOrderEnum } from "../const/GameEntityZOrderEnum";
import { PlayerArrow } from "../entity/PlayerArrow";
import { Role } from "../entity/role/Role";
import { RoleShadow } from "../entity/role/RoleShadow";
import { ConstValue } from "../const/ConstValue";
import { Util } from "../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 09:12:43 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-15 11:04:28
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

    public spawnRole(pos: cc.Vec2): Role {
        if (!this._gameRoot) return null;
        let resMgr = appContext.resourcesManager;
        let rolePrefab = resMgr.getPrefab(PrefabPathEnum.ROLE);
        if (!rolePrefab) return null;
        let poolMgr = appContext.poolManager;
        let roleNode = poolMgr.get(PoolEnum.ROLE, rolePrefab);
        if (!roleNode) return null;
        roleNode.position = pos;
        this._gameRoot.addChild(roleNode);
        let roleComp = roleNode.getComponent(Role);
        return roleComp;
    }

    public spawnRoleShadow(pos: cc.Vec2): RoleShadow {
        let shadowPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.ROLE_SHADOW);
        if (!shadowPrefab) return;
        let shadowNode = appContext.poolManager.get(PoolEnum.ROLE_SHADOW, shadowPrefab);
        shadowNode.position = pos;
        shadowNode.zIndex = GameEntityZOrderEnum.ROLE_SHADOW;
        this._gameRoot.addChild(shadowNode);
        if (!shadowNode) return;
        let roleShadow = shadowNode.getComponent(RoleShadow);
        return roleShadow;
    }

    public spawnPlayerArrow(pos: cc.Vec2): PlayerArrow {
        if (!this._gameRoot) return;
        let arrowPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.PLAYER_ARROW);
        if (!arrowPrefab) return;
        let arrowNode = appContext.poolManager.get(PoolEnum.PLAYER_ARROW, arrowPrefab);
        if (!arrowNode) return;
        arrowNode.position = pos;
        this._gameRoot.addChild(arrowNode);
        let arrowComp = arrowNode.getComponent(PlayerArrow);
        return arrowComp;
    }

    public spawnFireRocket(userX: number, attackerId: number, roadNo: number): void {
        if (!this._gameRoot) return;
        let resMgr = appContext.resourcesManager;
        let rocketPrefab = resMgr.getPrefab(PrefabPathEnum.FIRE_ROCKET);
        if (!rocketPrefab) return;
        let roadYArray = [].concat(ConstValue.ROAD_Y);
        roadYArray.splice(roadNo - 1, 1);
        let rocketCount = 2;
        for (let i = 0; i < rocketCount; i++) {
            let leftRoadCount = roadYArray.length;
            let roadIndex = Util.getRandomInt(0, leftRoadCount);
            let roadY = roadYArray[roadIndex];
            let fireRocketNode = appContext.poolManager.get(PoolEnum.FIRE_ROCKET, rocketPrefab);
            if (!fireRocketNode) continue;
            let x = userX + 1500;
            fireRocketNode.x = x;
            fireRocketNode.y = gameContext.mapManager.getY(x, roadY);
            fireRocketNode.zIndex = -roadY;
            this._gameRoot.addChild(fireRocketNode);
            let fireRocket = fireRocketNode.getComponent(FireRocket);
            if (!fireRocket) continue;
            fireRocket.bindData(roadY);
            roadYArray.splice(roadIndex, 1);
        }
    }

    public spawnLandEffect(pos: cc.Vec2, roadY: number): void {
        if (!this._gameRoot) return;
        let resMgr = appContext.resourcesManager;
        let landPrefab = resMgr.getPrefab(PrefabPathEnum.LAND);
        if (!landPrefab) return;
        let landNode = appContext.poolManager.get(PoolEnum.LAND, landPrefab);
        if (!landNode) return;
        landNode.position = pos;
        landNode.zIndex = -roadY;
        this._gameRoot.addChild(landNode);
    }

}