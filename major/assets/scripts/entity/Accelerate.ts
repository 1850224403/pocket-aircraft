import { FrameAnim } from "../util/FrameAnim";
import { RoleData } from "../data/RoleData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-15 14:13:32 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-15 14:42:46
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Accelerate extends cc.Component {

    @property({
        displayName: '图片',
        type: cc.Sprite
    })
    private spriteComp: cc.Sprite = null;

    @property({
        displayName: '帧动画',
        type: FrameAnim
    })
    private frameAnim: FrameAnim = null;

    private _isShowing: boolean = true;

    private _roleData: RoleData = null;

    public bindData(data: RoleData): void {
        this._roleData = data;
    }

    public update(dt: number): void {
        if (!this._roleData) return;
        let accelerate = this._roleData.speedIncrease > 0;
        if (this._isShowing && !accelerate) {
            this.hide();
        } else if (!this._isShowing && accelerate) {
            this.show();
        }
    }

    private show(): void {
        this._isShowing = true;
        this.spriteComp.enabled = true;
        this.frameAnim.enabled = true;
    }

    private hide(): void {
        this._isShowing = false;
        this.spriteComp.enabled = false;
        this.frameAnim.enabled = false;
    }

}