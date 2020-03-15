import { GameCommon, GameConfig } from "../GameCommon/GameCommon";
import { ShareManager } from "../ShareCommon/ShareManager";
import { MoreGameManager } from "../MoreGame/MoreGameManager";
import { VideoManager, VideoAdIns } from "./VideoManager";

export class BannerTaskManager {

    private static instance: BannerTaskManager = null;

    // 最多并行执行的任务数量
    private concurrency = 1;
    // 即将要执行的任务队列，会按照队列的顺序执行
    private queue = [];
    // 当前所有的任务的集合（包括执行中的和即将要执行的）
    private tasks = [];
    // 当前正在执行的任务数量
    private activeCount = 0;

    private push(task: () => Promise<any>): void {
        let self = this;
        this.tasks.push(new Promise(function (t, r) {
            var a = function () {
                self.activeCount++;
                try {
                    task().then(function (e) {
                        t(e);
                    }).then(function () {
                        self.next();
                    }).catch((error) => {
                        self.next();
                        console.error(error);
                    });
                } catch (error) {
                    self.next();
                    console.error(error);
                }
            };
            self.activeCount < self.concurrency ? a() : self.queue.push(a);
        }));
    };

    private all(): any {
        return Promise.all(this.tasks);
    };

    private next(): void {
        this.activeCount--;
        this.queue.length > 0 && this.queue.shift()();
    };

    private addTask(task: (success: () => void, fail: () => void) => void): void {

        function promiseTask() {
            return new Promise(function (resolve, reject) {
                task(
                    () => {
                        resolve("");
                    },
                    () => {
                        resolve("");
                    }
                );
            })
        }

        this.push(promiseTask);
    }

    /**
     * 添加需要执行的任务
     * @param task 必须包含成功和失败回调参数,同时保证回调必须被执行一次，否则会导致并行的任务无法取消
     */
    public static addTask(task: (success: () => void, fail: () => void) => void): void {
        if (this.instance == null) {
            this.instance = new BannerTaskManager();
        }
        this.instance.addTask(task);
    }
}

export class AdManager {

    private static wxBannerAd: any = null;

    public static bannerAdShow: boolean = false;//bannerAd是否展示中

    private static bannerAdLoading: boolean = false;//bannerAd是否加载中

    /**
     * 初始化加载视频广告
     */
    public static initVideoAd(): VideoAdIns {
        return VideoManager.createVideoIns(GameConfig.videoAdUnitId);
    }

    /**
     * 显示视频广告
     * @param endCallBack 播放视频正常结束回调
     * @param closeCallBack 播放视频中断或者提前关闭回调
     * @param videoShowCall 成功播放视频时的回调
     */
    public static showVideoAd(endCallBack: () => void, closeCallBack: () => void, videoShowCall: () => void) {
        let videoIns = VideoManager.getVideoIns(GameConfig.videoAdUnitId);
        if (videoIns == null) {
            VideoManager.createAndShowVideoIns(GameConfig.videoAdUnitId, endCallBack, closeCallBack, videoShowCall);
            return;
        }
        videoIns.showVideoAd(endCallBack, closeCallBack, videoShowCall);
    }

    /**
     * @return boolean 是否有视频广告可以播放
     */
    public static hasVideoAd(): boolean {
        return VideoManager.hasVideoIns(GameConfig.videoAdUnitId);
    }

    /**
     * 插屏广告实例
     */
    private static interstitialAd: any = null;

    /**
     * 初始化插屏广告实例
     */
    public static initInterstitialAD(): void {
        try {
            if (!GameCommon.isWechat() || typeof wx.createInterstitialAd != "function" || GameConfig.interstitialAdUnitId == null) {
                return;
            }

            this.interstitialAd = wx.createInterstitialAd({ adUnitId: GameConfig.interstitialAdUnitId });
            if (!this.interstitialAd) {
                return;
            }

            this.interstitialAd.onLoad(
                () => {
                }
            );
            this.interstitialAd.onError(
                (res) => {
                    console.error("插屏广告onError", res.errMsg, res.errCode);
                    this.interstitialAd = null;
                }
            );
            this.interstitialAd.onClose(
                () => {
                    console.error("关闭插屏广告");
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    /**
    * 显示插屏广告
    */
    public static showInterstitialAd(): void {

        if (!ShareManager.getInterstitialAdControl()) {
            return;
        }

        if (!GameCommon.isWechat() || VideoManager.hasVideoAdShow()) {
            return;
        }

        if (this.interstitialAd == null) {
            this.initInterstitialAD();
            return;
        }

        try {
            this.interstitialAd.show().catch(
                (err) => {
                    console.error(err);
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 加载banner广告
     *     /*left banner 广告组件的左上角横坐标
     * left btop banner 广告组件的左上角纵坐标
     * top bawidth banner 广告组件的宽度 Banner 广告组件的尺寸会根据设置的宽度进行等比缩放，缩放的范围是 300 到 屏幕宽度。屏幕宽度是以逻辑像素为单位的宽度,WxSDK.systemInfo.screenWidth
     * width onResizeCall 可以不传入，监听banner 广告尺寸变化事件后的回调方法，可在回调中动态设置banner的位置和大小
     */
    public static loadBannerAd(left: number, top: number, width: number, onResizeCall: (wxBannerAd: any) => void = null, loadSuccess: () => void = null, loadFail: () => void = null): void {
        this.bannerStyle = { left: left, top: top, width: width };
        this.onResizeCall = onResizeCall;
        let task = (success: () => void, fail: () => void) => {
            let successCall = () => {
                loadSuccess && loadSuccess();
                success && success();
            }
            let failCall = () => {
                loadFail && loadFail();
                fail && fail();
            }
            AdManager.loadBannerAdTask(successCall, failCall);
        }
        BannerTaskManager.addTask(task);
    }

    /**
     * 显示banner广告，必须保证调用过一次loadBanner 或者 loadAndShowBannerAd
     */
    public static showBannerAd(showSuccess: () => void): void {
        let task = (success: () => void, fail: () => void) => {
            let successCall = () => {
                showSuccess && showSuccess();
                success && success();
            };
            AdManager.showBannerAdTask(successCall, fail);
        };
        BannerTaskManager.addTask(task);
    }

    /**
     * 加载并显示banner广告
     * @param left banner 广告组件的左上角横坐标
     * @param top banner 广告组件的左上角纵坐标
     * @param width banner 广告组件的宽度 Banner 广告组件的尺寸会根据设置的宽度进行等比缩放，缩放的范围是 300 到 屏幕宽度。屏幕宽度是以逻辑像素为单位的宽度,WxSDK.systemInfo.screenWidth
     * @param onResizeCall 可以不传入，监听banner 广告尺寸变化事件后的回调方法，可在回调中动态设置banner的位置和大小
     */
    public static loadAndShowBannerAd(left: number, top: number, width: number, onResizeCall: (wxBannerAd: any) => void = null): void {
        this.bannerStyle = { left: left, top: top, width: width };
        this.onResizeCall = onResizeCall;
        if (!this.bannerAdLoading) {
            BannerTaskManager.addTask(this.loadBannerAdTask.bind(this));
        }
        BannerTaskManager.addTask(this.showBannerAdTask.bind(this));
    }

    /**
     * 隐藏banner广告
     */
    public static hideBannerAd(hideSuccess: () => void): void {
        let task = (success: () => void, fail: () => void) => {
            let successCall = () => {
                hideSuccess && hideSuccess();
                success && success();
            };
            AdManager.hideBannerAdTask(successCall, fail);
        };
        BannerTaskManager.addTask(task);
    }

    private static bannerStyle = { left: -10000, top: -10000, width: 300 };

    private static onResizeCall: (wxBannerAd: any) => void = null;

    private static loadBannerAdTask(successCall: () => void, failCall: () => void): void {
        if (this.bannerAdLoading) {
            successCall && successCall();
            successCall = null;
            failCall = null;
            return;
        }
        this.bannerAdLoading = true;
        let wxBannerAd = wx.createBannerAd({
            adUnitId: GameConfig.bannerAdUnitId,
            style: this.bannerStyle
        });
        let completed = false;
        wxBannerAd.onResize(() => {
            this.onResizeCall && this.onResizeCall(wxBannerAd);
        });
        wxBannerAd.onError((err) => {
            if (wxBannerAd._destroyed) {
                console.warn("loadBannerAd", "onError doubble call _destroyed", wxBannerAd);
                completed = true;
                this.bannerAdLoading = false;
                successCall && successCall();
                successCall = null;
                failCall = null;
                return;
            }

            completed = true;
            this.bannerAdLoading = false;
            wxBannerAd && wxBannerAd.destroy();
            if (this.wxBannerAd) {
                this.wxBannerAd.style.left = this.bannerStyle.left;
                this.wxBannerAd.style.top = this.bannerStyle.top;
                this.wxBannerAd.style.width = this.bannerStyle.width;
                this.onResizeCall && this.onResizeCall(this.wxBannerAd);
            }
            failCall && failCall();
            successCall = null;
            failCall = null;
            console.error(err);
        });
        wxBannerAd.onLoad(() => {

            if (wxBannerAd._destroyed) {
                console.warn("loadBannerAd", "onLoad doubble call _destroyed", wxBannerAd);
                completed = true;
                this.bannerAdLoading = false;
                successCall && successCall();
                successCall = null;
                failCall = null;
                return;
            }

            completed = true;
            this.bannerAdLoading = false;
            this.wxBannerAd && this.wxBannerAd.destroy();
            this.wxBannerAd = wxBannerAd;

            successCall && successCall();
            successCall = null;
            failCall = null;
        });

        //添加拉取广告超时时间
        setTimeout(() => {
            if (completed) {
                return;
            }

            if (wxBannerAd._destroyed) {
                console.warn("loadBannerAd", "setTimeout doubble call _destroyed", wxBannerAd);
                completed = true;
                this.bannerAdLoading = false;
                successCall && successCall();
                successCall = null;
                failCall = null;
                return;
            }

            this.bannerAdLoading = false;
            wxBannerAd && wxBannerAd.destroy();
            if (this.wxBannerAd) {
                this.wxBannerAd.style.left = this.bannerStyle.left;
                this.wxBannerAd.style.top = this.bannerStyle.top;
                this.wxBannerAd.style.width = this.bannerStyle.width;
                this.onResizeCall && this.onResizeCall(this.wxBannerAd);
            }
            failCall && failCall();
            successCall = null;
            failCall = null;
        }, 5000);
    }

    private static showBannerAdTask(successCall: () => void, failCall: () => void): void {
        if (this.wxBannerAd && ShareManager.getBannerAdControl() && !MoreGameManager.isMoreGameShow()) {
            this.bannerAdShow = true;
            this.wxBannerAd.show().then(
                () => {
                    if (this.onResizeCall == null) {
                        this.wxBannerAd.style.left = this.bannerStyle.left;
                        this.wxBannerAd.style.top = this.bannerStyle.top;
                        this.wxBannerAd.style.width = this.bannerStyle.width;
                    }
                    successCall && successCall();
                    if (MoreGameManager.isMoreGameShow()) {
                        AdManager.hideBannerAd(null);
                    }
                }
            ).catch(
                (err) => {
                    console.error(err);
                    failCall && failCall();
                }
            );
        } else {
            successCall && successCall();
        }
    }

    private static hideBannerAdTask(successCall: () => void, failCall: () => void): void {
        this.bannerAdShow = false;
        if (this.wxBannerAd != null) {
            this.wxBannerAd.hide().then(() => {
                successCall && successCall();
            }).catch((err) => {
                failCall && failCall();
            });
        }
        else {
            //显示猜你喜欢
            successCall && successCall();
        }
    }


    /**
     *  更新广告，上边沿紧贴某节点位置
     */
    public static loadBannerUpToNode(nodeheight: number, succeedCallBack: () => void, failedCallBack: () => void): void {
        let systemInfo = window.gameCommon.getSDK.getSystemInfo();
        if (!systemInfo) {
            failedCallBack && failedCallBack();
            return;
        }

        let canvasHeight = cc.Canvas.instance.node.height;
        let tarY = nodeheight * systemInfo.screenHeight / canvasHeight;
        tarY = systemInfo.screenHeight * 0.5 - tarY;
        let width = systemInfo.screenWidth * 0.8;
        if (width < 300) {
            width = 300;
        }
        let left = (systemInfo.screenWidth - width) / 2;
        //先执行隐藏banner task
        AdManager.hideBannerAd(null);
        AdManager.loadBannerAd(left, tarY, width, null, succeedCallBack, failedCallBack);
    }
}