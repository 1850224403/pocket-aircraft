import { ImageNumber } from "./ImageNumber";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-03 19:14:52 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-15 16:45:54
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerAssets extends cc.Component {

    @property({
        displayName: '金币',
        type: ImageNumber,
    })
    private coinNum: ImageNumber = null;

    @property({
        displayName: '钻石',
        type: ImageNumber,
    })
    private diamondNum: ImageNumber = null;

    private _coins: number = 0;

    private _diamonds: number = 0;

    public onLoad(): void {
        this._coins = appContext.userDataStorage.coin;
        this.coinNum.value = this._coins;
        this._diamonds = appContext.userDataStorage.diamond;
        this.diamondNum.value = this._diamonds;
    }

    public update(dt: number): void {
        this.refreshAssets();
    }

    private refreshAssets(): void {
        let curTotalCoins = appContext.userDataStorage.coin;
        let curTotalDiamands = appContext.userDataStorage.diamond;
        if (this._coins !== curTotalCoins) {
            this._coins = curTotalCoins;
            this.coinNum.value = this._coins;
        }
        if (this._diamonds !== curTotalDiamands) {
            this._diamonds = curTotalDiamands;
            this.diamondNum.value = this._diamonds;
        }
    }
}
