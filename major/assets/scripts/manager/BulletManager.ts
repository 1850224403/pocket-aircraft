import { PrefabPathEnum } from "../const/ResPathEnum";
import { PoolEnum } from "../const/PoolEnum";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { LogUtil } from "../util/LogUtil";
import { GameZOrderEnum } from "../const/ZOrderEnum";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-03-09 00:16:04 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-11 23:15:47
 */

export class BulletManager {

    private _bulletPrefab: cc.Prefab = null;

    private _parent: cc.Node = null;

    public init(): void {
        let path = PrefabPathEnum.BULLET + '01';
        let prefab = appContext.resourcesManager.getPrefab(path);
        if (!prefab) return;
        this._bulletPrefab = prefab;

        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }
        let bullerContianer = new cc.Node('BulletContianer');
        bullerContianer.zIndex = GameZOrderEnum.BULLET;
        gameRoot.addChild(bullerContianer);
        this._parent = bullerContianer;
    }

    public createBullet(pos: cc.Vec2): void {
        if (!this._bulletPrefab || !this._parent) return;
        let bulletType = PoolEnum.BULLET + '01';
        let bulletNode = appContext.poolManager.get(bulletType, this._bulletPrefab);
        if (!bulletNode) return;
        bulletNode.position = pos;
        this._parent.addChild(bulletNode);
    }

}
