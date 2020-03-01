import { RoleData } from "../data/RoleData";
import { MotionCameraData } from "../data/MotionCameraData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 17:05:10 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-15 20:00:21
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class MotionCamera extends cc.Component {

    private _camera: cc.Camera = null;

    private _data: MotionCameraData = new MotionCameraData();

    private _playerData: RoleData = null;

    private _minY: number = 300;

    private _maxY: number = 600;

    public bindData(camera: cc.Camera): void {
        this.node.x = 380;
        this._camera = camera;
        this._playerData = gameContext.battleData.playerData;
        gameContext.battleData.motionCamData = this._data;
    }

    public lateUpdateSelf(): void {
        if (!this._playerData) {
            this._playerData = gameContext.battleData.playerData;
            return;
        }

        if (!this._camera) {
            return;
        }

        let canvas = cc.game.canvas;
        let playerPos = this._playerData.pos;
        if (playerPos.y <= this._minY) {
            this.node.y = 0;
            this._camera.zoomRatio = 1;
        } else if (playerPos.y < this._maxY) {
            let offset = playerPos.y - this._minY;
            this.node.y = offset;
            this._camera.zoomRatio = canvas.height / (canvas.height + offset * 2);
        } else {
            let offset = this._maxY - this._minY;
            this.node.y = offset;
            this._camera.zoomRatio = canvas.height / (canvas.height + offset * 2);
        }

        let endX = gameContext.mapManager.getEndX();
        if (playerPos.x > endX) {
            return;
        }
        let offset = this._playerData.speed / 30;
        this.node.x = playerPos.x + 180 - offset;
    }

}