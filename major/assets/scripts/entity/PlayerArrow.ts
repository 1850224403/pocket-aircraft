import { RoleData } from "../data/RoleData";

const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerArrow extends cc.Component {

    private _roleData: RoleData = null;

    public bindData(data: RoleData): void {
        this._roleData = data;
    }

    public update(dt: number): void {
        if (!this._roleData) return;
        let pos = this._roleData.pos;
        this.node.position = cc.v2(pos.x-5, pos.y + 130);
    }
}
