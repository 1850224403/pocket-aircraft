import { CarItem } from "./CarItem";
import { ImageNumber } from "../../entity/ImageNumber";
import { RoleSkinEnum } from "../../const/RoleSkinEnum";
import { TipManager } from "../../../gamecommon/Script/Tip/TipManager";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-12 10:09:03 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 19:20:37
 */
const { ccclass, property } = cc._decorator;

const ITEM_WIDTH = 216;
const LOCK_COLOR = cc.color(66, 66, 66);
const UNLOCK_COLOR = cc.color(255, 255, 255);
const MAX_X = 0;
const MIN_X = -510;

@ccclass
export class GarageUI extends cc.Component {

    @property({
        displayName: '车辆列表',
        type: [CarItem]
    })
    private carList: CarItem[] = [];

    @property({
        displayName: '展示Skin',
        type: sp.Skeleton
    })
    private showSkin: sp.Skeleton = null;

    @property({
        displayName: '车辆容器',
        type: cc.Node
    })
    private carContent: cc.Node = null;

    @property({
        displayName: '选中',
        type: cc.Node
    })
    private selectNode: cc.Node = null;

    @property({
        displayName: '售价节点',
        type: cc.Node
    })
    private costNode: cc.Node = null;

    @property({
        displayName: '售价',
        type: ImageNumber
    })
    private costValue: ImageNumber = null;

    private _selectSkin: number = RoleSkinEnum.SKIN_1;

    public onEnable(): void {
        // 有用别删
        // for (const key in RoleSkinEnum) {
        //     let keyToAny: any = key;
        //     if (!isNaN(keyToAny)) {
        //     }
        // }
        for (let i = 0; i < this.carList.length; i++) {
            let car = this.carList[i];
            car.bindData(i + 1);
        }

        let currentSkin = appContext.userDataStorage.currentSkin;
        this._selectSkin = currentSkin;
        this.refreshSelect();
        this.refreshCar();
        this.bindTouch();
    }

    public onDisable(): void {
        this.unbindTouch();
    }

    private refreshSelect(): void {
        let userStorage = appContext.userDataStorage;
        let car = this.carList[this._selectSkin - 1];
        this.showSkin.skeletonData = car.getSkeletonData();
        this.selectNode.x = car.node.x;
        let hasSkin = userStorage.hasSkin(this._selectSkin);
        if (hasSkin) {
            this.costNode.active = false;
            this.showSkin.node.color = UNLOCK_COLOR;
            userStorage.changeSkin(this._selectSkin);
        } else {
            this.costNode.active = true;
            let cost = this.getCarCost();
            this.costValue.value = cost;
            this.showSkin.node.color = LOCK_COLOR;
        }
    }

    private refreshCar(): void {
        for (const car of this.carList) {
            car.refreshShow();
        }
    }

    private clickBuy(): void {
        let userStorage = appContext.userDataStorage;
        let roleDiamond = userStorage.diamond;
        let cost = this.getCarCost();
        if (roleDiamond < cost) {
            TipManager.showTip('钻石不足!');
            return;
        }
        userStorage.costDiamond(cost);
        userStorage.gainSkin(this._selectSkin);
        this.refreshSelect();
        this.refreshCar();
    }

    private bindTouch(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    }

    private unbindTouch(): void {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
    }

    private touchStart(e: cc.Event.EventTouch): void {
        let touchX = e.getLocationX();
        let index = (touchX - this.carContent.x) / ITEM_WIDTH;
        index = cc.misc.clampf(index, RoleSkinEnum.SKIN_1, RoleSkinEnum.SKIN_5);
        index = Math.ceil(index);
        this._selectSkin = index;
        this.refreshSelect();
    }

    private touchMove(e: cc.Event.EventTouch): void {
        let moveX = e.getDeltaX();
        this.carContent.x += moveX;
        this.carContent.x = cc.misc.clampf(this.carContent.x, MIN_X, MAX_X);
    }

    private getCarCost(): number {
        let cost = 0;
        switch (this._selectSkin) {
            case RoleSkinEnum.SKIN_1:
                cost = 200;
                break;

            case RoleSkinEnum.SKIN_2:
                cost = 0;
                break;

            case RoleSkinEnum.SKIN_3:
                cost = 400;
                break;

            case RoleSkinEnum.SKIN_4:
                cost = 600;
                break;

            case RoleSkinEnum.SKIN_5:
                cost = 800;
                break;

            default:
                break;
        }
        return cost;
    }

}