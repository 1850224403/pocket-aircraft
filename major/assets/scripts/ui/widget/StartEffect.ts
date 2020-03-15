
const { ccclass, property } = cc._decorator;

@ccclass
export class StartLeftEffect extends cc.Component {

    @property({
        displayName: '左动画',
        type: cc.Node,
    })
    private left: cc.Node = null;

    @property({
        displayName: '右动画',
        type: cc.Node,
    })
    private right: cc.Node = null;

    public onLoad(): void {
        this.setLeftEffect();
        this.setRightEffect();
    }

    private setRightEffect(): void {
        this.right.position = cc.v2(168, 2);
        this.right.opacity = 255;
        this.right.stopAllActions();

        let spawn = cc.spawn(
            cc.moveBy(1, cc.v2(30, 0)),
            cc.fadeTo(1, 0)
        );
        let callFunc = cc.callFunc(() => {
            this.right.x -= 30;
            this.right.opacity = 255;
        });
        let seq = cc.sequence(spawn, callFunc);
        this.right.runAction(cc.repeatForever(seq));
    }

    private setLeftEffect(): void {
        this.left.position = cc.v2(-155, 2);
        this.left.opacity = 255;
        this.left.stopAllActions();

        let spawn = cc.spawn(
            cc.moveBy(1, cc.v2(-30, 0)),
            cc.fadeTo(1, 0)
        );
        let callFunc = cc.callFunc(() => {
            this.left.x += 30;
            this.left.opacity = 255;
        });
        let seq = cc.sequence(spawn, callFunc);
        this.left.runAction(cc.repeatForever(seq));
    }
}
