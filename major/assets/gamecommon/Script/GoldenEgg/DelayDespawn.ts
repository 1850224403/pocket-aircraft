import { GameCommonPool } from "../GameCommon/GameCommonPool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DelayDespawn extends cc.Component {

    @property
    private delay: number = 1;

    private timer: number = 0;

    protected onEnable(): void {
        this.timer = 0;
    }

    protected update(dt: number): void {
        this.timer += dt;
        if (this.timer > this.delay) {
            GameCommonPool.returnInstant(this.node);
        }
    }

}
