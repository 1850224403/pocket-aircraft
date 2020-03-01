import { TipManager } from "../../gamecommon/Script/Tip/TipManager";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-02-04 19:44:01 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-02-07 15:19:01
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class WxEvent extends cc.Component {

    public static currentShareEnum: string = null;

    public static onShowCallback: () => void = null;

    private static _videoStarCall: () => void = null;
    public static get videoStarCall(): () => void {
        return WxEvent._videoStarCall;
    }

    private static _videoEndCall: () => void = null;
    public static get videoEndCall(): () => void {
        return WxEvent._videoEndCall;
    }

    public static bindData(starCall: () => void, endCall: () => void): void {
        this._videoStarCall = starCall;
        this._videoEndCall = endCall;
    }

    public onLoad(): void {
        let self = this;
        let sdk = window.gameCommon.getSDK;
        sdk.registerOnShow(
            (res: any) => {
                // 添加微信onShow事件
                if (!WxEvent.currentShareEnum) {
                    return;
                }

                if (WxEvent.onShowCallback) {
                    WxEvent.onShowCallback();
                }

                WxEvent.currentShareEnum = null;
                WxEvent.onShowCallback = null;
            }
        );

        sdk.registerOnHide(
            () => {
                if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                    return;
                }
            }
        );
    }
}
