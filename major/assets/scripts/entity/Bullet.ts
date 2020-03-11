import { PoolEnum } from "../const/PoolEnum";
import { LogUtil } from "../util/LogUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class Bullet extends cc.Component {

    public update(dt: number): void {
        this.node.y += 10;
        if (this.node.y >= 2000) {
            this.destroySelf();
        }
    }

    public onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if(other.tag === 5) {
            LogUtil.log('打到');
            other.destroy();
            this.destroySelf();
        }

    }

    private destroySelf(): void {
        let bulletType = PoolEnum.BULLET + '01';
        appContext.poolManager.add(bulletType, this.node);
    }
}
