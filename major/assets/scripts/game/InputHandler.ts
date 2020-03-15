import { Role } from "../entity/role/Role";
import { LogUtil } from "../util/LogUtil";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 14:24:50 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-05 00:58:45
 */
const { ccclass, property } = cc._decorator;

const TOUCH_OFFSET: number = 2;
const SLOW_DOWN_DELAY: number = 1;

@ccclass
export class InputHandler extends cc.Component {

    private _player: Role = null;

    private _delayTimer: number = 0;

    private _lastClickPos: cc.Vec2 = cc.v2(0, 0);

    public start(): void {
    }

    public bindPlayer(player: Role): void {
        this._player = player;
    }

    public onEnable(): void {
        this.bindTouchEvent();
    }

    public onDisable(): void {
        this.touchEnd();
        this.disbindTouchEvent();
    }

    private bindTouchEvent(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    private disbindTouchEvent(): void {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
        this.node.off(cc.Node.EventType.TOUCH_END);
    }

    private touchStart(e: cc.Event.EventTouch): void {
        this._lastClickPos = e.getLocation();
    }

    private touchMove(e: cc.Event.EventTouch): void {
        if (this._delayTimer > 0.01) {
            let sub = e.getLocation().sub(this._lastClickPos);
            this._player.data.pos = this._player.data.pos.add(sub);
            this._lastClickPos = e.getLocation();
            this._delayTimer = 0;
        }
    }

    private touchEnd(): void {
    }

    public update(dt: number): void {
        this._delayTimer += dt;
    }
}
