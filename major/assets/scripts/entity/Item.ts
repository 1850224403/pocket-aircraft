import { ItemData } from "../data/ItemData";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-09 09:40:19 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-13 20:13:30
 */
const { ccclass, property } = cc._decorator;

@ccclass
export abstract class Item extends cc.Component {

    protected _poolType: string = null;

    protected _data: ItemData = null;
    public get data(): ItemData {
        return this._data;
    }

    public abstract bindPoolType(): void;

    public bindData(data: ItemData): void {
        this._data = data;
        this.bindPoolType();
    }
    public destroySelf(): void {
        if (this._poolType === null) return;
        appContext.poolManager.add(this._poolType, this.node);
    }
}