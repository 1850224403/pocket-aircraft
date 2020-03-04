import { RoleData } from "../data/RoleData";
import { Util } from "../util/Util";
import { Role } from "../entity/role/Role";
import { AI } from "../entity/ai/AI";
import { LowAI } from "../entity/ai/LowAI";
import { MiddleAI } from "../entity/ai/MiddleAI";
import { HighAI } from "../entity/ai/HighAI";
import { AILevelEnum } from "../const/AILevelEnum";
import { RoleSkinEnum } from "../const/RoleSkinEnum";
import { UpgradeEnum } from "../const/UpgradeEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-26 18:52:51 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-05 00:13:29
 */
export class RoleManager {

    private _player: Role = null;
    public get player(): Role {
        return this._player;
    }

    private _roleList: Set<Role> = new Set();

    private _aiList: Set<AI> = new Set();

    private _finalRanking: number = 0;
    public get finalRanking(): number {
        return this._finalRanking;
    }
    public setFinalRanking(): void {
        this._finalRanking = this.getPlayerRanking();
    }

    public getRoleByID(id: number): Role {
        let aimRole = null;
        this._roleList.forEach((key, role) => {
            if (role && role.data.id === id) {
                aimRole = role;
            }
        });
        return aimRole;
    }

    public init(): void {
        this._roleList = new Set();
        this._aiList = new Set();
        for (let i = 1; i <= 5; i++) {
            if (i === 1) {
                this.createPlayer();
            } else {
                this.createEnemy(i);
            }
        }
    }

    public updateSelf(dt: number): void {
        this._roleList.forEach((key, role) => {
            role && role.updateSelf(dt);
        });
        this._aiList.forEach((key, ai) => {
            ai && ai.updateSelf(dt);
        });
        this.refalshRanking();

    }

    private createPlayer(): void {
        // 玩家属性等级数据
        let userStorage = appContext.userDataStorage;
        // 初始化玩家数据
        let roleData = new RoleData();
        roleData.id = 1;
        roleData.maxA = 24;
        roleData.roadY = 28;
        roleData.rolePropertyLevel = userStorage.propertyLevel;
        let x = 200;
        let y = 200;
        roleData.pos = cc.v2(x, y);
        // 创建玩家
        let player = gameContext.gameSpawner.spawnRole(roleData.pos);
        if (!player) return;
        player.bindData(roleData);
        gameContext.battleData.playerData = roleData;
        this._player = player;
        this._roleList.add(player);
    }

    private createEnemy(i: number): void {
        // 创建敌人数据
        let levelData = gameContext.battleData.levelData;
        if (!levelData) return;
        let aiConfig = levelData.aiConfig;
        if (!aiConfig) return;
        let roleData = new RoleData();
        roleData.id = i;
        roleData.skinId = Util.getRandomInt(RoleSkinEnum.SKIN_1, RoleSkinEnum.SKIN_5 + 1);
        roleData.aa = Util.getRandomInt(aiConfig.minAcceleratedSpeed, aiConfig.maxAcceleratedSpeed);
        roleData.maxA = 24;
        roleData.maxSpeed = Util.getRandomInt(aiConfig.minSpeed, aiConfig.maxSpeed);
        roleData.moveYValue = 200;
        roleData.lowNitrogenAddSpeed = 300;
        roleData.roadY = 28 + 67 * (i - 1);
        let x = 0;
        let y = 200;
        roleData.pos = cc.v2(x, y);
        // 生成敌人
        let enemy = gameContext.gameSpawner.spawnRole(roleData.pos);
        if (!enemy) return;
        let shadow = gameContext.gameSpawner.spawnRoleShadow(roleData.pos);
        shadow && shadow.bindData(roleData);
        enemy.bindData(roleData);
        this._roleList.add(enemy);

        let level = appContext.userDataStorage.currentLevel;
        let delayStart = Util.getRandomFloat(0, 0.5);
        let ai: AI = null;
        let aiLevel: AILevelEnum = AILevelEnum.LOW;
        if (level <= 3) {
            ai = new LowAI();
            aiLevel = AILevelEnum.LOW;
        } else if (level <= 15) {
            ai = new MiddleAI();
            aiLevel = AILevelEnum.MIDDLE;
        } else {
            ai = new HighAI();
            aiLevel = AILevelEnum.HIGH;
        }
        ai.bindData(aiLevel, enemy, delayStart);
        this._aiList.add(ai);
    }

    public clear(): void {
        this._roleList.clear();
        this._aiList.clear();
    }

    public getPlayerRanking(): number {
        if (this._player && this._player.data) {
            return this.player.data.ranking;
        }
        return 0;
    }

    public refalshRanking(): void {
        let roleArray = new Array<Role>();
        this._roleList.forEach((key, role) => {
            role && roleArray.push(role);
        })
        let sortNum = (a: Role, b: Role) => {
            if (a && b && a.data && b.data) {
                return b.data.pos.x - a.data.pos.x;
            }
            return;
        }
        roleArray.sort(sortNum);
        roleArray.forEach((role, number) => {
            if (role && role.data) {
                role.data.ranking = number + 1;
            }
        });
    }
}