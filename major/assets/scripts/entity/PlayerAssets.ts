import { ImageNumber } from "./ImageNumber";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-03 19:14:52 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-19 17:06:44
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerAssets extends cc.Component {

    @property({
        displayName: '数字',
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
        if (!this.diamondNum) return;
        this._diamonds = appContext.userDataStorage.diamond;
        this.diamondNum.value = this._diamonds;
    }

    public update(dt: number): void {
        let curTotalCoins = appContext.userDataStorage.coin;
        let curTotalDiamands = appContext.userDataStorage.diamond;
        if (this._coins !== curTotalCoins) {
            this._coins = curTotalCoins;
            this.coinNum.value = this._coins;
        }

        if (this.diamondNum && this._diamonds !== curTotalDiamands) {
            this._diamonds = curTotalDiamands;
            this.diamondNum.value = this._diamonds;
        }

    }
}
