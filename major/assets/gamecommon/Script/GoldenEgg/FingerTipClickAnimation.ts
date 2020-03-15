const { ccclass, property } = cc._decorator;

@ccclass
export class FingerTipClickAnimation extends cc.Component {

    @property(cc.Node)
    private finger: cc.Node = null;

    @property(cc.Node)
    private circle: cc.Node = null;

    private _fingerPosition: cc.Vec2 = null;

    private _fingerTargetPosition: cc.Vec2 = null;

    onLoad() {

        if (this.finger == null || this.circle == null) {
            return;
        }

        this._fingerPosition = cc.v2(this.finger.x, this.finger.y);

        this._fingerTargetPosition = cc.v2(this.finger.x - 10, this.finger.y);
    }

    onEnable() {

        if (this.finger == null || this.circle == null) {
            return;
        }

        this.finger.stopAllActions();
        this.finger.x = this._fingerPosition.x;
        this.finger.y = this._fingerPosition.y;
        this.finger.scale = 1;
        this.circle.stopAllActions();
        this.circle.scale = 0;
        this.circle.opacity = 0;

        this.finger.runAction(cc.repeatForever(
            cc.sequence(
                cc.moveTo(0.15, this._fingerTargetPosition),
                cc.delayTime(0.1),
                cc.moveTo(0.25, this._fingerPosition)
            )
        ));

        this.finger.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.15, 0.8),
                cc.delayTime(0.1),
                cc.scaleTo(0.25, 1)
            )
        ));

        this.circle.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.25, 1.5).easing(cc.easeCubicActionOut()),
                cc.delayTime(0.1),
                cc.scaleTo(0.15, 0)
            )
        ));

        this.circle.runAction(cc.repeatForever(
            cc.sequence(
                cc.fadeIn(0.05),
                cc.fadeOut(0.25),
                cc.delayTime(0.2)
            )
        ));
    }
}
