import { FrameAnim } from "../util/FrameAnim";
import { RoleData } from "../data/RoleData";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-13 09:35:32 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-13 12:07:18
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class Deceleration extends cc.Component {

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

    private _data: RoleData = null;

    private _hasShow: boolean = false;

    public bindData(data: RoleData): void {
        this._data = data;
        this.endDeceleration();
    }

    public startDeceleration(): void {
        this.spriteComp.enabled = true;
        this.frameAnim.enabled = true;
    }

    public update(dt: number): void {
        if (!this._data) return;
        if (!this._data.inGround) return;
        if (!this._hasShow && this._data.speedDecrease > 0) {
            let scale = this._data.speedDecrease / 10;
            this.node.scale = scale;
            this.startDeceleration();
            this._hasShow = true;
        }
        else if (this._hasShow && this._data.speedDecrease <= 0) {
            this.endDeceleration();
            this._hasShow = false;
            this.node.scale = 1;
        }
    }

    public endDeceleration(): void {
        this.spriteComp.enabled = false;
        this.frameAnim.enabled = false;
    }
}
