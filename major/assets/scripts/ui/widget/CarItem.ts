import { RoleSkinEnum } from "../../const/RoleSkinEnum";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-11 19:45:30 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 13:42:57
 */
const { ccclass, property } = cc._decorator;

const LOCK_COLOR = cc.color(66, 66, 66);
const UNLOCK_COLOR = cc.color(255, 255, 255);

@ccclass
export class CarItem extends cc.Component {

    @property({
        displayName: 'roleSpine',
        type: sp.Skeleton
    })
    private roleSpine: sp.Skeleton = null;

    @property({
        displayName: '解锁',
        type: cc.Node
    })
    private unlockNode: cc.Node = null;

    private _skinType: RoleSkinEnum = RoleSkinEnum.SKIN_1;
    public get skinType(): RoleSkinEnum {
        return this._skinType;
    }

    public bindData(skinType: RoleSkinEnum): void {
        this._skinType = skinType;
    }

    public getSkeletonData(): sp.SkeletonData {
        return this.roleSpine.skeletonData;
    }

    public refreshShow(): void {
        let hasSkin = appContext.userDataStorage.hasSkin(this._skinType);
        let color = UNLOCK_COLOR;
        if (!hasSkin) color = LOCK_COLOR;
        this.unlockNode.active = !hasSkin;
        this.roleSpine.node.color = color;
    }

}
