import { LogUtil } from "../util/LogUtil";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-17 15:03:26 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-17 15:55:40
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class ShockManager {

    public get isShockOn(): boolean {
        return appContext.userDataStorage.isShockOn;
    }

    public init(): void {
    }

    public switchShock(): void {
        appContext.userDataStorage.switchShock();
    }

    public shortShock(): void {
        if (!this.isShockOn) return;
        window.gameCommon.getSDK.vibrateShort();
    }

    public longShock(): void {
        if (!this.isShockOn) {
            LogUtil.log('无法震动');
        }
        if (!this.isShockOn) return;
        window.gameCommon.getSDK.vibrateLong();
    }
}
