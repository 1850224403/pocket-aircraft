import { RoleData } from "../data/RoleData";
import { CollisionTagEnum } from "../const/CollisionTagEnum";
import { Item } from "../entity/Item";
import { FireRocket } from "../entity/FireRocket";
import { RoleAnim } from "../animation/RoleAnim";
import { AudioEnum } from "../const/AudioEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-08 09:25:39 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-05 00:04:50
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleBodyColliderHandler extends cc.Component {


    private _data: RoleData = null;

    public bindData(data: RoleData): void {
        this._data = data;
    }

    public onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (!this._data) return;

    }
}