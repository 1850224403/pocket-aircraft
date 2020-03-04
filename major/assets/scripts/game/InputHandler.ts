import { Role } from "../entity/role/Role";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-27 14:24:50 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-02 00:53:25
 */
const { ccclass, property } = cc._decorator;

const TOUCH_OFFSET: number = 2;
const SLOW_DOWN_DELAY: number = 1;

@ccclass
export class InputHandler extends cc.Component {

    private _player: Role = null;

    /** 是否按住屏幕 */
    private _isHold: boolean = false;

    private _movingTimer: number = 0;

    private _slowDownTimer: number = 0;

    public start(): void {
        this._isHold = false;
        this._movingTimer = 0;
        this._slowDownTimer = 0;
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
        this._isHold = true;
        if (this._player && this._player.node) {
            this._player.touchStart();
        }
        gameContext.gameManager.gameResume();
    }

    private touchMove(e: cc.Event.EventTouch): void {
        let yOffset = e.getDeltaY();
        let canMove = Math.abs(yOffset) > TOUCH_OFFSET;
        if (canMove) {
            this._movingTimer = 0.3;
            (this._player && this._player.node) && this._player.move(yOffset);
        }
    }

    private touchEnd(): void {
        (this._player && this._player.node) && this._player.touchEnd();
        this._isHold = false;
        this._slowDownTimer = 0;
    }

    public update(dt: number): void {
        if (!this._player || !this._player.node) {
            return;
        }
        let before = this._movingTimer;
        this._movingTimer -= dt;
        let after = this._movingTimer;
        if (before > 0 && after <= 0) {
            this._player.touchEnd();
        }

        if (this._isHold) {
            this._player.speedUp();
        } else {
            this._slowDownTimer += dt;
            if (this._slowDownTimer > SLOW_DOWN_DELAY) this._player.speedDown();
        }
    }
}
