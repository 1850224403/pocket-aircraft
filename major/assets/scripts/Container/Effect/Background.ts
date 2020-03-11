import { SettlementPanel } from "../../ui/panel/SettlementPanel";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-03-06 00:03:14 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-09 00:35:24
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class Background extends cc.Component {

    private _length: number = 0;
    public onEnable(): void {
        this._length = this.node.height;
    }
    public updateSelf(dt: number): void {
        this.node.y -= 5;
        if (this.node.y <= - this._length + 1000) {
            appContext.uiManager.showUI(SettlementPanel);
        }
    }

}
