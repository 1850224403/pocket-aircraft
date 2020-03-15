const { ccclass, property } = cc._decorator;

@ccclass
export class MultiTouchManager extends cc.Component {

    @property({ displayName: "开启多点触摸" })
    private open: boolean = false;

    public static currentTouchId: number = -1;

    public static currentTouchNodeId: string = null;

    public static setCurrentTouchInfo(currentTouchId: number, currentTouchNodeId: string): void {
        console.log("set currentTouchId: %d, currentTouchNodeId: %o .", currentTouchId, currentTouchNodeId);
        this.currentTouchId = currentTouchId;
        this.currentTouchNodeId = currentTouchNodeId;
    }

    public static resetCurrentTouchInfo(): void {
        console.log("reset currentTouchInfo.");
        this.currentTouchId = -1;
        this.currentTouchNodeId = null;
    }

    public onLoad(): void {
        
        if (this.open) {
            return;
        }

        var dispatchEvent = cc.Node.prototype.dispatchEvent;
        cc.Node.prototype.dispatchEvent = function (event) {
            switch (event.type) {

                case 'touchstart':
                    if (MultiTouchManager.currentTouchId > -1) {
                        return;
                    }

                    console.log("touchstart");
                    MultiTouchManager.setCurrentTouchInfo(event.touch._id, event.getCurrentTarget()._id);
                    dispatchEvent.call(this, event);
                    break;

                case 'touchmove':
                    if (MultiTouchManager.currentTouchId === -1) {
                        MultiTouchManager.setCurrentTouchInfo(event.touch._id, event.getCurrentTarget()._id);
                        console.warn("touchmove with set currentTouchId");
                        dispatchEvent.call(this, event);
                    } else {
                        if (MultiTouchManager.currentTouchId != event.touch._id) {
                            return;
                        }

                        console.log("touchmove");
                        dispatchEvent.call(this, event);
                    }
                    break;

                case 'touchend':
                    if (MultiTouchManager.currentTouchId != event.touch._id) {
                        return;
                    }

                    console.log("touchend");
                    MultiTouchManager.resetCurrentTouchInfo();
                    dispatchEvent.call(this, event);
                    break;

                case 'touchcancel':
                    if (MultiTouchManager.currentTouchId != event.touch._id) {
                        return;
                    }

                    console.log("touchcancel");
                    MultiTouchManager.resetCurrentTouchInfo();
                    dispatchEvent.call(this, event);
                    break;

                default:
                    dispatchEvent.call(this, event);
            }
        };

        var onPostActivated = cc.Node.prototype._onPostActivated;
        cc.Node.prototype._onPostActivated = function (active) {
            if (!active && MultiTouchManager.currentTouchNodeId == this._id) {
                console.log("disactive node");
                MultiTouchManager.resetCurrentTouchInfo();
            }
            onPostActivated.call(this, active);
        };

        var __onPreDestroy__ = cc.Node.prototype._onPreDestroy;
        cc.Node.prototype._onPreDestroy = function () {
            if (MultiTouchManager.currentTouchNodeId == this._id) {
                console.log("destroy node");
                MultiTouchManager.resetCurrentTouchInfo();
            }
            __onPreDestroy__.call(this);
        };
    }
}
