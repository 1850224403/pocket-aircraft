
const { ccclass, property } = cc._decorator;

const CLOSE_SHINE_DELAY: number = 0.2;

@ccclass
export class RoleShine extends cc.Component {

    private _timer: number = 0;

    public onEnable(): void {
        this._timer = 0;
    }

    public update(dt: number) {
        this._timer += dt;
        if (this._timer > CLOSE_SHINE_DELAY) {
            this._timer = 0;
            this.node.active = false;
        }
    }
}
