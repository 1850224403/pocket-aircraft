import { RoleData } from "../../data/RoleData";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-13 19:01:39 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-04 00:53:57
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleShadow extends cc.Component {

    private _roleData: RoleData = null;

    private _rotateSpeed: number = 4.2;

    public bindData(data: RoleData): void {
        this._roleData = data;
    }

    public update(dt: number): void {
        if (!this._roleData) return;

    }

}