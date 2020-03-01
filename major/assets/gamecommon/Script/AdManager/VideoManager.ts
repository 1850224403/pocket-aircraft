import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { UserData } from "../GameCommon/UserData";
import { ShareManager } from "../ShareCommon/ShareManager";
import { TipManager } from "../Tip/TipManager";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";

/**
 * Created by 席庆功
 * Time: 2019/08/20.
 */
export class VideoManager {
    //储存所有videoIns
    private static readonly videoAdMap: Map<string, VideoAdIns> = new Map();

    /**
     * 添加videoIns到map
     * @param videoIns 
     */
    private static addVideoIns(videoIns: VideoAdIns): void {
        if (videoIns == null || videoIns.videoAdUnitId == null) {
            return;
        }
        this.videoAdMap.set(videoIns.videoAdUnitId, videoIns);
    }

    /**
     * 获取是否已经创建过视频实例，没有的话需要创建实例
     * @param videoAdUnitId 视频广告id 
     */
    public static hasVideoIns(videoAdUnitId: string): boolean {
        if (videoAdUnitId == null) {
            return false;
        }
        return this.videoAdMap.get(videoAdUnitId) != null;
    }

    /**
     * 初始化创建视频实例并加入map中
     * @param videoAdUnitId 视频广告id 
     */
    public static createVideoIns(videoAdUnitId: string): VideoAdIns {

        let videoIns = this.getVideoIns(videoAdUnitId);
        if (videoIns != null) {
            return videoIns;
        }

        //由于微信基础库2.8.0以前只支持单例，则每次创建新的视频实例都需要销毁旧的
        let systemInfo = window.gameCommon.getSDK.getSystemInfo();
        if (systemInfo != null && GameCommonUtil.compareVersion(systemInfo.SDKVersion, '2.8.0') < 0) {
            let videoInsArray = Array.from(this.videoAdMap.values());
            videoIns = videoInsArray && videoInsArray[0];
            if (videoIns != null) {
                videoIns.reInitVideoAd(videoAdUnitId, null);
                this.videoAdMap.clear();
                this.addVideoIns(videoIns);
                return videoIns;
            }
        }
        videoIns = new VideoAdIns();
        videoIns.initVideoAd(videoAdUnitId, null);
        this.addVideoIns(videoIns);
        return videoIns;
    }

    /**
     * 初始化创建视频实例并加入map中,广告加载成功后立即播放视频
     * @param videoAdUnitId 视频广告id 
     */
    public static createAndShowVideoIns(videoAdUnitId: string, endCallBack: () => void, closeCallBack: () => void, videoShowCall: () => void, noVideoCall: () => void = null): VideoAdIns {

        let videoIns = this.getVideoIns(videoAdUnitId);
        if (videoIns != null) {
            return videoIns;
        }

        //由于微信基础库2.8.0以前只支持单例，则每次创建新的视频实例都需要销毁旧的
        let systemInfo = window.gameCommon.getSDK.getSystemInfo();
        if (systemInfo != null && GameCommonUtil.compareVersion(systemInfo.SDKVersion, '2.8.0') < 0) {
            let videoInsArray = Array.from(this.videoAdMap.values());
            videoIns = videoInsArray && videoInsArray[0];
            if (videoIns != null) {
                //广告加载成功的回调
                videoIns.loadSuccessCall = () => {
                    videoIns.showVideoAd(endCallBack, closeCallBack, videoShowCall);
                }
                videoIns.reInitVideoAd(videoAdUnitId, noVideoCall);
                this.videoAdMap.clear();
                this.addVideoIns(videoIns);
                return videoIns;
            }
        }
        videoIns = new VideoAdIns();
        //广告加载成功的回调
        videoIns.loadSuccessCall = () => {
            videoIns.showVideoAd(endCallBack, closeCallBack, videoShowCall);
        }
        videoIns.initVideoAd(videoAdUnitId, noVideoCall);
        this.addVideoIns(videoIns);
        return videoIns;
    }

    /**
     * 获取已经创建过视频实例，没有的话需要创建实例
     * 获取后通过VideoAdIns.hasVideoAd()判断是否有可以播放的视频，通过VideoAdIns.showVideoAd()来播放视频
     * @param videoAdUnitId 视频广告id 
     */
    public static getVideoIns(videoAdUnitId: string): VideoAdIns {
        if (videoAdUnitId == null) {
            return null;
        }
        return this.videoAdMap.get(videoAdUnitId);
    }

    /**
     * 获取是否有视频正在播放
     */
    public static hasVideoAdShow(): boolean {
        let videoAdShow = false;
        this.videoAdMap.forEach((videoAdIns: VideoAdIns, id: string) => {
            if (videoAdIns == null) {
                return;
            }
            videoAdShow = videoAdShow || videoAdIns.videoAdShow;
        });
        return videoAdShow;
    }
}

export class VideoAdIns {
    //视频广告id
    public videoAdUnitId: string = null;
    //wx视频广告实例
    public videoAd: any = null;
    //视频广告是否准备好
    public videoAdReady: boolean = false;
    //播放视频正常结束回调
    private endCallBack: () => void = null;
    //播放视频中断回调
    private closeCallBack: () => void = null;
    //观看视频的开始时间
    private videoStartTime: number = null;
    //veidoAd是否展示中
    public videoAdShow: boolean = false;
    //广告加载成功后的回调 每次调用后清空
    public loadSuccessCall: () => void = null;

    public timeoutId: NodeJS.Timeout = null;

    /**
     * 初始化加载视频广告
     */
    public initVideoAd(videoAdUnitId: string, noVideoCall: () => void): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME || videoAdUnitId == null) {
            return;
        }
        if (wx == null || wx.createRewardedVideoAd == null || typeof wx.createRewardedVideoAd !== 'function') {
            return;
        }
        this.videoAdUnitId = videoAdUnitId;

        try {
            this.videoAd = wx.createRewardedVideoAd({ adUnitId: videoAdUnitId, multiton: true });

            if (!this.videoAd) {
                noVideoCall && noVideoCall();
                return;
            }

            this.videoAd.onLoad(this.loadCallBack.bind(this));

            this.videoAd.onError((err) => {
                this.timeoutId && clearTimeout(this.timeoutId);
                this.timeoutId = null;
                noVideoCall && noVideoCall();
                this.errorCallBack && this.errorCallBack(err);
            });

            this.videoAd.onClose(this.closeVedioCallBack.bind(this));

            this.timeoutId = setTimeout(() => {
                noVideoCall && noVideoCall();
            }, 5000);
        } catch (error) {
            console.error(error);
            this.timeoutId && clearTimeout(this.timeoutId);
            this.timeoutId = null;
            noVideoCall && noVideoCall();
        }
    }

    /**
     * 重新初始化视频广告实例，只在2.8.0版本之前不支持多例时会被使用
     */
    public reInitVideoAd(videoAdUnitId: string, noVideoCall: () => void): void {
        if (this.videoAd == null) {
            return this.initVideoAd(videoAdUnitId, noVideoCall);
        }

        if (cc.sys.platform !== cc.sys.WECHAT_GAME || videoAdUnitId == null) {
            return;
        }
        if (wx == null || wx.createRewardedVideoAd == null || typeof wx.createRewardedVideoAd !== 'function') {
            return;
        }
        this.videoAdUnitId = videoAdUnitId;

        try {
            this.videoAd = wx.createRewardedVideoAd({ adUnitId: videoAdUnitId, multiton: true });
            if (!this.videoAd) {
                return;
            }
            this.videoAdReady = false;
            this.videoAd.load().then(() => {
                this.videoAdReady = true;
                this.loadSuccessCall && this.loadSuccessCall();
                this.loadSuccessCall = null;
            }).catch(err => {
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    }

    private loadCallBack(): void {
        this.videoAdReady = true;
        this.loadSuccessCall && this.loadSuccessCall();
        this.loadSuccessCall = null;
        this.timeoutId && clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }

    private errorCallBack(err): void {
        console.error(err);
    }

    private closeVedioCallBack(res): void {
        this.videoAdShow = false;
        let interval = this.videoStartTime ? ((Date.now() - this.videoStartTime) / 1000).toFixed(2) : 0;
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) {
            StatisticsManager.thirdSendEvent("观看完整视频", "end_watch_video", { "时间": interval });
            // 正常播放结束，可以下发游戏奖励
            this.endCallBack && this.endCallBack();
            UserData.data.adSuccess++;
            UserData.userActions.adSuccess++;
        } else {
            StatisticsManager.thirdSendEvent("取消观看视频", "cancel_watch_video", { "时间": interval });
            // 播放中途退出，不下发游戏奖励
            this.closeCallBack && this.closeCallBack();
        }
    }

    /**
     * @return boolean 是否有视频广告可以播放
     */
    public hasVideoAd(): boolean {
        if (!ShareManager.getVideoAdControl()) {
            return false;
        }
        if (this.videoAd == null) {
            return false;
        }

        if (!this.videoAdReady) {
            this.videoAd.load().then(() => {
                this.videoAdReady = true;
            }).catch(err => {
                console.error(err);
            });
            return false;
        }

        return true;
    }

    /**
     * 显示视频广告
     * @param endCallBack 播放视频正常结束回调
     * @param closeCallBack 播放视频中断或者提前关闭回调
     * @param videoShowCall 成功播放视频时的回调
     */
    public showVideoAd(endCallBack: () => void, closeCallBack: () => void, videoShowCall: () => void) {

        if (!ShareManager.getVideoAdControl()) {
            endCallBack && endCallBack();
            return;
        }

        // 广告播放中不允许再播放其他广告
        if (this.videoAdShow) {
            return;
        }

        if (this.videoAd == null) {
            this.initVideoAd(this.videoAdUnitId, null);
            TipManager.showTip("啊呀，视频还没送达，等一下再试试吧~");
            return;
        }

        StatisticsManager.thirdSendEvent("点击播放视频", "click_watch_video");

        this.videoAdShow = true;
        this.videoAd.load().then(() => {
            videoShowCall && videoShowCall();
            this.videoAd.show().then(() => {
                UserData.data.adOpen++;
                UserData.userActions.adOpen++;
                this.videoAdReady = false;
                this.endCallBack = endCallBack;
                this.closeCallBack = closeCallBack;
                this.videoStartTime = Date.now();
            }).catch(err => {
                console.error(err);
                this.videoAdShow = false;
                closeCallBack && closeCallBack();
                TipManager.showTip("啊呀，视频还没送达，等一下再试试吧~");
            })
        }).catch(err => {
            console.error(err);
            this.videoAdShow = false;
            TipManager.showTip("啊呀，视频还没送达，等一下再试试吧~");
        });;
    }
}

