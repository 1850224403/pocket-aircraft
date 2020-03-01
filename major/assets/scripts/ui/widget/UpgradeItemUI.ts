import { UpgradeEnum } from "../../const/UpgradeEnum";
import { ImageNumber } from "../../entity/ImageNumber";
import { ConstValue } from "../../const/ConstValue";
import { TipManager } from "../../../gamecommon/Script/Tip/TipManager";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-11 15:03:32 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 19:44:53
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class UpgradeItemUI extends cc.Component {

    @property({
        displayName: '升级类型',
        type: cc.Enum(UpgradeEnum)
    })
    private type: UpgradeEnum = UpgradeEnum.SPEED;

    @property({
        displayName: '进度条',
        type: cc.Sprite
    })
    private progress: cc.Sprite = null;

    @property({
        displayName: '价格',
        type: ImageNumber
    })
    private price: ImageNumber = null;

    @property({
        displayName: '已满级',
        type: cc.Node
    })
    private maxLevel: cc.Node = null;

    private _level: number = 1;

    private _price: number = 0;

    private _maxLevel: number = 0;

    public start(): void {
        this.clacMaxLevel();
        this._level = appContext.userDataStorage.getPropertyLevel(this.type);
        this.refreshShow();
    }

    public update(dt: number): void {
        let level = appContext.userDataStorage.getPropertyLevel(this.type);
        if (level != this._level) {
            this._level = level;
        }
        this.refreshShow();
    }

    private clacMaxLevel(): void {
        switch (this.type) {
            case UpgradeEnum.SPEED:
                this._maxLevel = ConstValue.SPEED_MAX_LEVEL;
                break;

            case UpgradeEnum.ACELERATE:
                this._maxLevel = ConstValue.ACLERATE_MAX_LEVEL;
                break;

            case UpgradeEnum.BALANCE:
                this._maxLevel = ConstValue.BALANCE_MAX_LEVEL;
                break;

            case UpgradeEnum.SKILL:
                this._maxLevel = ConstValue.SKILL_MAX_LEVEL;
                break;

            default:
                break;
        }
    }

    private refreshShow(): void {
        if (this._level >= this._maxLevel) {
            this.maxLevel.active = true;
            this.price.node.active = false;
        } else {
            this.maxLevel.active = false;
            this.price.node.active = true;
            let price = 0;
            let upLevel = this._level + 1;
            if (upLevel < 7) {
                price = (upLevel - 1) * 10;
            } else if (upLevel < 13) {
                price = (upLevel - 2) * 20;
            } else {
                price = (upLevel - 3) * 30;
            }
            if (this.type === UpgradeEnum.BALANCE) {
                price *= 5;
            }
            this._price = price;
            this.price.value = price;
        }

        this.progress.fillRange = this._level / this._maxLevel;
    }

    private clickUpgrade(): void {
        if (this._level >= this._maxLevel) return;
        let userStorage = appContext.userDataStorage;
        let userCoin = userStorage.coin;
        if (userCoin < this._price) {
            TipManager.showTip('金币不足!');
            return;
        }
        userStorage.costCoin(this._price);
        userStorage.upgradeProperty(this.type);

    }

}