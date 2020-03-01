import { LogUtil } from "../util/LogUtil";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { MotionCamera } from "../game/MotionCamera";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 15:54:51 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2019-12-28 16:07:53
 */
export class CameraManager {

    private _motionCamera: MotionCamera = null;

    public init(): void {
        let canvas = cc.Canvas.instance.node;
        let gameRoot = canvas.getChildByName(NodeNameEnum.GAME_ROOT);
        if (!gameRoot) {
            LogUtil.err('can not find game root in canvas');
            return;
        }

        let motionCameraNode = new cc.Node('MotionCamera');
        let camera = motionCameraNode.addComponent(cc.Camera);
        camera.cullingMask = -2;
        this._motionCamera = motionCameraNode.addComponent(MotionCamera);
        this._motionCamera.bindData(camera);
        gameRoot.addChild(motionCameraNode);
    }

    public lateUpdateSelf(): void {
        this._motionCamera && this._motionCamera.lateUpdateSelf();
    }

    public clear(): void {
        if (!this._motionCamera || !this._motionCamera.node) {
            return;
        }
        this._motionCamera.node.destroy();
        this._motionCamera = null;
    }

    public getCameraPos(): cc.Vec2 {
        return this._motionCamera.node.position;
    }

    public isInScreen(pos: cc.Vec2): boolean {
        let cameraPosX = this._motionCamera.node.x;
        if (pos.x > cameraPosX - 400 && pos.x < cameraPosX + 250) return true;
        return false;
    }
}