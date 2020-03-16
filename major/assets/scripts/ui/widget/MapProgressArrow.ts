import { RoleData } from "../../data/RoleData";

const { ccclass, property } = cc._decorator;

@ccclass
export class MapProgressArrow extends cc.Component {

    private _roleId: number = 0;

    private _data: RoleData = null;

    private _startX: number = 0;

    private _endX: number = 0;

    public bindData(id: number, startX: number, endX: number): void {
        this._roleId = id;
        this._startX = startX;
        this._endX = endX;
    }

    public init(): void {
        this._data = null;
        let role = gameContext.roleManager.getRoleByID(this._roleId);
        if (role && role.data) {
            this._data = role.data;
        }
    }

    public update(dt: number): void {
        if (!this._data) return;
        this.node.zIndex = (6 - this._data.ranking);
        let mapMgr = gameContext.mapManager;
        let startPoint = mapMgr.getStartX();
        let endPoint = mapMgr.getEndX();
        let precent = (this._data.pos.x - startPoint) / (endPoint - startPoint);
        precent = cc.misc.clamp01(precent);
        this.node.x = cc.misc.lerp(this._startX, this._endX, precent);
        if (this._data.isPlayer && precent >= 1) {
            gameContext.gameManager.gameOver(true);
        }
    }
}
