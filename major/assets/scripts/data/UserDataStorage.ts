import { UserData } from "../../gamecommon/Script/GameCommon/UserData";
import { RolePropertyLevelData } from "./RolePropertyLevelData";
import { UpgradeEnum } from "../const/UpgradeEnum";
import { ConstValue } from "../const/ConstValue";
import { RoleSkinEnum } from "../const/RoleSkinEnum";
import { LogUtil } from "../util/LogUtil";

/*
 * @Author: Feifan Chen 
 * @Date: 2019-11-09 13:44:07 
 * @Description: 用户持久化数据 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-15 16:47:44
 */
const { ccclass, property } = cc._decorator;

const MAX_LEVEL: number = 36;

@ccclass
export class UserDataStorage {

    public get coin(): number {
        return UserData.data.otherData.coin;
    }
    public set coin(value: number) {
        UserData.data.otherData.coin = value;
    }

    public get diamond(): number {
        return UserData.data.otherData.diamond;
    }
    public set diamond(value: number) {
        UserData.data.otherData.diamond = value;
    }

    public get currentSkin(): number {
        return UserData.data.otherData.currentSkin;
    }
    public set currentSkin(value: number) {
        UserData.data.otherData.currentSkin = value;
    }

    public get currentLevel(): number {
        return UserData.data.otherData.currentLevel;
    }
    public set currentLevel(value: number) {
        UserData.data.otherData.currentLevel = value;
    }

    public get grant(): boolean {
        return UserData.data.otherData.grant;
    }
    public set grant(value: boolean) {
        UserData.data.otherData.grant = value;
    }

    public get propertyLevel(): RolePropertyLevelData {
        return UserData.data.otherData.propertyLevel;
    }
    public set propertyLevel(value: RolePropertyLevelData) {
        UserData.data.otherData.propertyLevel = value;
    }

    public get ownSkin(): number[] {
        return UserData.data.otherData.ownSkin;
    }

    constructor() {
        this.init();
    }

    public init() {
        !UserData.data.otherData && (UserData.data.otherData = {});
        let otherData = UserData.data.otherData;
        if (otherData.coin === void 0) {
            otherData.coin = 0;
        }
        if (otherData.currentSkin === void 0) {
            otherData.currentSkin = RoleSkinEnum.SKIN_2;
            otherData.ownSkin = [RoleSkinEnum.SKIN_2];
        }
        if (otherData.currentLevel === void 0) {
            otherData.currentLevel = 1;
        }
        if (otherData.diamond === void 0) {
            otherData.diamond = 0;
        }
        if (otherData.grant === void 0) {
            otherData.grant = false;
        }
        if (otherData.propertyLevel === void 0) {
            otherData.propertyLevel = new RolePropertyLevelData();
        }
        if (otherData.isAudioOn === void 0) {
            otherData.isAudioOn = true;
        }
        if (otherData.isShockOn === void 0) {
            otherData.isShockOn = true;
        }
        this.compensateDiamond();
    }

    public addCoin(value: number): void {
        if (!value) return;
        value = Math.round(value);
        if (value <= 0) return;
        this.coin += value;
    }

    public costCoin(value: number): void {
        if (!value) return;
        value = Math.round(value);
        if (value <= 0) return;
        this.coin -= value;
    }

    public addDiamond(value: number): void {
        if (!value) return;
        value = Math.round(value);
        if (value <= 0) return;
        this.diamond += value;
    }

    public costDiamond(value: number): void {
        if (!value) return;
        value = Math.round(value);
        if (value <= 0) return;
        this.diamond -= value;
    }

    public passLevel(): void {
        this.currentLevel += 1;
        this.diamond += 50;
        if (this.currentLevel > MAX_LEVEL) {
            this.currentLevel = 1;
        }
    }

    public gainSkin(skin: number): void {
        skin = Math.round(skin);
        if (skin < 1 || skin > 5) {
            LogUtil.err('不存在皮肤', skin);
            return;
        }
        let index = this.ownSkin.indexOf(skin);
        if (index !== -1) {
            return;
        }
        this.ownSkin.push(skin);
    }

    public changeSkin(skin: number): void {
        let index = this.ownSkin.indexOf(skin);
        if (index === -1) {
            return;
        }
        this.currentSkin = skin;
    }

    public hasSkin(skin: number): boolean {
        let index = this.ownSkin.indexOf(skin);
        return index != -1;
    }

    public getPropertyLevel(type: UpgradeEnum): number {
        let level = 1;
        switch (type) {
            case UpgradeEnum.SPEED:
                level = this.propertyLevel.speedLevel;
                break;

            case UpgradeEnum.ACELERATE:
                level = this.propertyLevel.aclerateLevel;
                break;

            case UpgradeEnum.BALANCE:
                level = this.propertyLevel.balanceLevel;
                break;

            case UpgradeEnum.SKILL:
                level = this.propertyLevel.skillLevel;
                break;

            default:
                break;
        }
        return level;
    }

    public upgradeProperty(type: UpgradeEnum): number {
        let level = 1;
        switch (type) {
            case UpgradeEnum.SPEED:
                if (this.propertyLevel.speedLevel >= ConstValue.SPEED_MAX_LEVEL) break;
                this.propertyLevel.speedLevel++;
                break;

            case UpgradeEnum.ACELERATE:
                if (this.propertyLevel.aclerateLevel >= ConstValue.ACLERATE_MAX_LEVEL) break;
                this.propertyLevel.aclerateLevel++;
                break;

            case UpgradeEnum.BALANCE:
                if (this.propertyLevel.balanceLevel >= ConstValue.BALANCE_MAX_LEVEL) break;
                this.propertyLevel.balanceLevel++;
                break;

            case UpgradeEnum.SKILL:
                if (this.propertyLevel.skillLevel >= ConstValue.SKILL_MAX_LEVEL) break;
                this.propertyLevel.skillLevel++;
                break;

            default:
                break;
        }
        return level;
    }

    private compensateDiamond(): void {
        if (!UserData.newUser && !this.grant) {
            let diamondGrant = (this.currentLevel - 1) * 50;
            this.addDiamond(diamondGrant);
            this.grant = true;
        }
    }

    public switchAudio(): void {
        this.isAudioOn = !this.isAudioOn;
    }

    public switchShock(): void {
        this.isShockOn = !this.isShockOn;
    }
}
