import { NitrogenDialog } from "./NitrogenDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export class TouchLayer extends cc.Component {

    public onEnable(): void {
        this.bindTouchEvent();
    }

    public onDisable(): void {
        this.disbindTouchEvent();
    }

    private bindTouchEvent(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    }

    private disbindTouchEvent(): void {
        this.node.off(cc.Node.EventType.TOUCH_START);
    }

    private touchStart(e: cc.Event.EventTouch): void {
        appContext.uiManager.hideUI(NitrogenDialog);
    }
}
