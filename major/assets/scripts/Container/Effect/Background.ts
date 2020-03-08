import { SettlementPanel } from "../../ui/panel/SettlementPanel";
import { LogUtil } from "../../util/LogUtil";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-03-06 00:03:14 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-08 23:51:18
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
        LogUtil.log(this.node.y, this._length);
        if (this.node.y <= - this._length + 1000) {
            appContext.uiManager.showUI(SettlementPanel);
        }
    }

}
