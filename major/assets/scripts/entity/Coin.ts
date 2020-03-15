import { PoolEnum } from "../const/PoolEnum";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-04 17:02:42 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 19:29:34
 */

const { ccclass, property } = cc._decorator;

const COIN_VALUE = 5;

@ccclass
export class Coin extends cc.Component {

    private _value: number = 0;

    private _aimPos: cc.Vec2 = null;
    public get aimPos(): cc.Vec2 {
        return this._aimPos;
    }
    public set aimPos(value: cc.Vec2) {
        this._aimPos = value;
    }

    public init(aimPos: cc.Vec2, speed: number): void {
        this._aimPos = aimPos;
        this._value = COIN_VALUE;
        this.move(speed);
    }

    private move(speed: number): void {
        this.node.stopAllActions();
        let a = this.node.position.sub(this._aimPos);
        let distance = a.mag();
        let time = distance / speed;
        let seq = cc.sequence(
            cc.moveTo(time, this._aimPos),
            cc.callFunc(this.removeCoin, this)
        );
        this.node.runAction(seq);
    }

    public removeCoin(): void {
        appContext.poolManager.add(PoolEnum.COIN, this.node);
        appContext.userDataStorage.addCoin(this._value);
    }
}
