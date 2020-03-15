import { ShareManager, ShareControlType } from "./ShareCommon/ShareManager";
import { AdManager } from "./AdManager/AdManager";
import { StatisticsManager } from "./StatisticsManager/StatisticsManager";
import { TipManager } from "./Tip/TipManager";

export class ShareAdHelper {

    public static ShareFirst(eventName: string, onSuccess, onFailed?: any) {
        if (ShareManager.getShareControlType() != ShareControlType.ShareCloseAndAdOpen) {
            ShareAdHelper.tripleLieShare(eventName, onSuccess);
        }
        else {
            ShareAdHelper.AdFirst(eventName, onSuccess);
        }
    }

    public static AdFirst(eventName: string, onSuccess: any, onFailed?: any): void {
        if (AdManager.hasVideoAd()) {
            if (eventName) {
                StatisticsManager.thirdSendEvent(eventName + "_视频开始");
            }
            cc.audioEngine.pauseAll();
            window.gameCommon.getSDK.showWxLoading("处理中...", null, 1);

            //播放广告
            AdManager.showVideoAd(
                //播放广告成功
                () => {
                    if (eventName) {
                        StatisticsManager.thirdSendEvent(eventName + "_视频成功");
                    }
                    cc.audioEngine.resumeAll();
                    onSuccess && onSuccess();
                },
                //播放广告失败
                () => {
                    if (eventName) {
                        StatisticsManager.thirdSendEvent(eventName + "_视频失败");
                    }
                    cc.audioEngine.resumeAll();
                    if (onFailed) {
                        onFailed();
                    }
                    else {
                        TipManager.showTip("观看完整视频才能获得奖励哦~");
                    }
                }, null
            );
        }
        else if (ShareManager.getShareControlType() == ShareControlType.ShareAndAdOpen) {
            window.gameCommon.getSDK.share(eventName, null, null, (res: any, success: boolean) => {
                if (success) {
                    onSuccess && onSuccess();
                }
                else {
                    onFailed && onFailed();
                }
            }, true);
        }
        else {
            TipManager.showTip("暂时没有广告，请稍后再试");
        }
    }

    public static normalShare(eventName: string): void {
        window.gameCommon.getSDK.share(eventName, null, null, (res: any, success: boolean) => {
        }, true);
    }

    public static tripleLieShare(eventName: string, callBack: (success: boolean) => void): void {
        window.gameCommon.getSDK.share(eventName, null, null, (res: any, success: boolean) => {
            if (callBack) {
                callBack(success);
            }
        }, true);
    }

    /**
     * 仅观看视频
     */
    public static adOnly(onSuccess: any, eventName: string, onFailed?: any): void {
        if (AdManager.hasVideoAd()) {
            cc.audioEngine.pauseAll();
            window.gameCommon.getSDK.showWxLoading("处理中...", null, 1);
            if (eventName) {
                StatisticsManager.thirdSendEvent(eventName + "_点开视频");
            }
            //播放广告
            AdManager.showVideoAd(
                //播放广告成功
                () => {
                    if (eventName) {
                        StatisticsManager.thirdSendEvent(eventName + "_成功播放视频");
                    }
                    cc.audioEngine.resumeAll();
                    onSuccess && onSuccess();
                },
                //播放广告失败
                () => {
                    if (eventName) {
                        StatisticsManager.thirdSendEvent(eventName + "_取消播放视频");
                    }
                    cc.audioEngine.resumeAll();
                    if (onFailed) {
                        onFailed();
                    }
                    else {
                        TipManager.showTip("观看完整视频才能获得奖励哦~");
                    }
                }, null
            );
        }
        else {
            TipManager.showTip("视频没有准备好，请稍后重试哦!");
        }
    }
}
