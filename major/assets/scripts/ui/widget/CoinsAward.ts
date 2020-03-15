import { PrefabPathEnum } from "../../const/ResPathEnum";
import { Coin } from "../../entity/Coin";
import { ImageNumber } from "../../entity/ImageNumber";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-04 16:20:11 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 18:04:22
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class CoinsAward extends cc.Component {

    @property({
        displayName: '金币数',
        type: ImageNumber
    })
    private coinsNum: ImageNumber = null;

    @property({
        displayName: '总金币',
        type: cc.Node,
    })
    private totalCoins: cc.Node = null;

    @property({
        displayName: '金币层',
        type: cc.Node,
    })
    private coinLayer: cc.Node = null;

    private _coins: number = 0;

    public init(playerRanking: number): void {
        this._coins = 60 - playerRanking * 10;
        this.setCoinsNum();
        this.scheduleOnce(this.createCoins, 0.5);
    }

    private setCoinsNum(): void {
        this.coinsNum.value = this._coins;
    }

    private createCoins(): void {
        let num = this._coins / 5;
        let coinPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.COIN);
        if (!coinPrefab) return;
        for (let i = 0; i < num; i++) {
            let coinNode = appContext.poolManager.get('coin', coinPrefab);
            let coin = coinNode.getComponent(Coin);
            coinNode.parent = this.coinLayer;
            coinNode.position = cc.v2(120 + 30 * i, -200 + 30 * i);
            if (!coin) continue;
            coin.init(this.totalCoins.position, 600);
        }
    }

    public removeCoins(): void {
        let coins = this.coinLayer.children;
        for (let i = 0; i < coins.length;) {
            let child = coins[i];
            let coin = child.getComponent(Coin);
            if (!coin) continue;
            coin.removeCoin();
        }
    }
}
