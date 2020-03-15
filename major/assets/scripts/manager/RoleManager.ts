import { RoleData } from "../data/RoleData";
import { Util } from "../util/Util";
import { Role } from "../entity/role/Role";
import { AI } from "../entity/ai/AI";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:52:51 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-15 17:14:22
 */
export class RoleManager {

    private _player: Role = null;
    public get player(): Role {
        return this._player;
    }

    public init(): void {
        this.createPlayer();
    }

    public updateSelf(dt: number): void {
        this._player.updateSelf(dt);
    }

    private createPlayer(): void {
        // 玩家属性等级数据
        let userStorage = appContext.userDataStorage;
        // 初始化玩家数据
        let roleData = new RoleData();
        roleData.id = 1;
        roleData.rolePropertyLevel = userStorage.propertyLevel;
        let x = 0;
        let y = 0;
        roleData.pos = cc.v2(x, y);
        // 创建玩家
        let player = gameContext.gameSpawner.spawnPlayer(roleData.pos);
        if (!player) return;
        player.bindData(roleData);
        gameContext.battleData.playerData = roleData;
        this._player = player;
    }

    public clear(): void {
        this._player = null;
    }