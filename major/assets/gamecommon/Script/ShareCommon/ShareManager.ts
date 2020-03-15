import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameConfig } from "../GameCommon/GameCommon";

export class ShareManager {

    public static newStatisticUrl: string = "https://hfws.dcgstd.cn/statistic-service/";

    public static getNewShareFlagUrl: string = "https://hfapi2.dcgstd.cn/wegame-service/new/shareFlags/query";

    private static getShareConfigUrl: string = "https://hffile.dcgstd.cn/share/";

    public static cdnFileUrl: string = "https://hffile.dcgstd.cn";

    public static dataStorageUrl: string = "https://hfapi2.dcgstd.cn/dataStorage-service/dataStorage";

    //默认分享图
    private static defaultShareInfo: ShareInfo = null;
    //低质量分享图组
    private static readonly lowShareInfos: Array<ShareInfo> = new Array();
    //高质量分享图组
    private static readonly highShareInfos: Array<ShareInfo> = new Array();

    private static masterControl: boolean = true;//总开关，默认打开

    private static shareControl: boolean = true;//分享开关，默认打开,关闭则使用视频

    private static abnormalShareControl: boolean = true;//非正常分享开关，默认打开,关闭则使用普通分享

    private static shareImgControl: boolean = true;//分享图高质量（正常）是否开启，默认打开，开启后才会根据城市判断是否使用低质量（低俗）的图，否则一律使用高质量（正常）的图

    private static volationShareControl: boolean = true;//是否开启违规分享，默认开启

    private static bannerAdControl: boolean = true;//是否开启banner广告，默认开启

    private static adControl: boolean = true;//是否开启广告，默认开启

    private static interstitialAdControl: boolean = true;//是否开启插屏广告，默认开启

    private static spriteControl: boolean = true;//复刻版审核图控制开关，默认开启

    private static moreGameControl: boolean = true;//九宫格导出控制开关，默认开启

    private static carouseControl: boolean = true;//轮播导出控制开关, 默认开启

    private static horizontalControl: boolean = true;//跑马灯导出控制开关, 默认开启

    private static passAllControl: boolean = true;//通关导出控制开关, 默认开启

    private static passPartControl: boolean = true;//过关导出控制开关，默认开启

    private static fullScreenControl: boolean = true;//全屏导出控制开关

    private static adFramesControl: boolean = true;//动态图导出控制开关

    private static bannerMistakeTouchControl: boolean = true;//banner误触开关

    public static city: string = null;//玩家所属城市

    public static ipValid: boolean = false;

    public static shareFlags: any = null;//存放shareFlags获取的开关配置的源数据
    public static configData: any = null;//存放cdn获取的config配置的源数据

    private static eggControl: boolean = true;//砸金蛋开关

    //砸金蛋
    public static eggDialogCloseBtnWaitTime: number = 4;//砸金蛋关闭按钮延迟显示时间
    public static eggShowInterval: number = 60;//秒 金蛋刷新间隔
    public static refreshBannerInterval: number = 15;//游戏界面banner刷新时间

    /**
     * 替换新的域名
     * @param domainName 二级域名
     */
    public static resetDomainName(domainName: string): void {
        if (domainName == null) {
            return;
        }

        this.newStatisticUrl = this.newStatisticUrl.replace("dcgstd.cn", domainName);
        this.getNewShareFlagUrl = this.getNewShareFlagUrl.replace("dcgstd.cn", domainName);
        this.getShareConfigUrl = this.getShareConfigUrl.replace("dcgstd.cn", domainName);
        this.cdnFileUrl = this.cdnFileUrl.replace("dcgstd.cn", domainName);
        this.dataStorageUrl = this.dataStorageUrl.replace("dcgstd.cn", domainName);
    }

    /**
     * 初始化分享配置
     * @param shareControlFlag //获取分享开关需要的flag
     */
    public static init(initSuccCallBack: () => void = null): void {

        var appName = GameConfig.wxAppName;

        this.getShareConfigUrl = this.cdnFileUrl + "/game-common/" + appName + "/newConfig.txt?time=" + Date.now();

        this.defaultShareInfo = new ShareInfo(
            "default",
            "又发现一个好玩的小游戏，来试试吧~",
            this.cdnFileUrl + "/game-common/" + appName + "/default.png"
        );

        var self = this;
        var initShareConfigCall = function (): void {

            var initShareCall = function (): void {
                if (initSuccCallBack != null) {
                    initSuccCallBack();
                }
            }
            //下载分享配置
            self.initShareControl(initShareCall);
        }

        this.initShareConfig(initShareConfigCall);

        this.initIpValid();
    }

    private static initShareConfig(initShareConfigCall: () => void): void {

        var self = this;

        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null) {
                if (initShareConfigCall != null) {
                    initShareConfigCall();
                }
                return;
            }
            ShareManager.configData = retData;
            if (retData.newStatisticUrl != null) {
                ShareManager.newStatisticUrl = retData.newStatisticUrl;
                console.log(retData.newStatisticUrl);
            }
            if (retData.getNewShareFlagUrl != null) {
                ShareManager.getNewShareFlagUrl = retData.getNewShareFlagUrl;
                console.log(retData.getNewShareFlagUrl);
            }
            var shareImgConfig = retData.shareInfos;
            if (shareImgConfig != null) {
                for (var shareImg of shareImgConfig) {
                    self.addShareInfo(shareImg.shareKey, shareImg.shareText, shareImg.shareImgUrl, shareImg.shareImgName);
                }
            }
            if (initShareConfigCall != null) {
                initShareConfigCall();
            }
        };

        GameCommonHttp.wxHttpGet(this.getShareConfigUrl, callBack);
    }

    private static initShareControl(initSuccCallBack: () => void): void {

        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null) {
                if (initSuccCallBack != null) {
                    initSuccCallBack();
                }
                return;
            }
            var shareFlags = retData;
            ShareManager.shareFlags = shareFlags;
            if (shareFlags["masterControl"] != null) {
                ShareManager.masterControl = shareFlags["masterControl"];
            }
            if (shareFlags["shareControl"] != null) {
                ShareManager.shareControl = shareFlags["shareControl"];
            }
            if (shareFlags["abnormalShareControl"] != null) {
                ShareManager.abnormalShareControl = shareFlags["abnormalShareControl"];
            }
            if (shareFlags["shareImgControl"] != null) {
                ShareManager.shareImgControl = shareFlags["shareImgControl"];
            }
            if (shareFlags["moreGameControl"] != null) {
                ShareManager.moreGameControl = shareFlags["moreGameControl"];
            }
            if (shareFlags["carouseControl"] != null) {
                ShareManager.carouseControl = shareFlags["carouseControl"];
            }
            if (shareFlags["horizontalControl"] != null) {
                ShareManager.horizontalControl = shareFlags["horizontalControl"];
            }
            if (shareFlags["passAllControl"] != null) {
                ShareManager.passAllControl = shareFlags["passAllControl"];
            }
            if (shareFlags["passPartControl"] != null) {
                ShareManager.passPartControl = shareFlags["passPartControl"];
            }
            if (shareFlags["fullScreenControl"] != null) {
                ShareManager.fullScreenControl = shareFlags["fullScreenControl"];
            }
            if (shareFlags["adFramesControl"] != null) {
                ShareManager.adFramesControl = shareFlags["adFramesControl"];
            }
            if (shareFlags["volationShareControl"] != null) {
                ShareManager.volationShareControl = shareFlags["volationShareControl"];
            }
            if (shareFlags["adControl"] != null) {
                ShareManager.adControl = shareFlags["adControl"];
            }
            if (shareFlags["bannerAdControl"] != null) {
                ShareManager.bannerAdControl = shareFlags["bannerAdControl"];
            }
            if (shareFlags["spriteControl"] != null) {
                ShareManager.spriteControl = shareFlags["spriteControl"];
            }
            if (shareFlags["bannerMistakeTouchControl"] != null) {
                ShareManager.bannerMistakeTouchControl = shareFlags["bannerMistakeTouchControl"];
            }
            if (shareFlags["interstitialAdControl"] != null) {
                ShareManager.interstitialAdControl = shareFlags["interstitialAdControl"];
            }
            if (shareFlags["eggControl"] != null) {
                ShareManager.eggControl = shareFlags["eggControl"];
            }
            if (shareFlags["eggDialogCloseBtnWaitTime"] != null) {
                ShareManager.eggDialogCloseBtnWaitTime = shareFlags["eggDialogCloseBtnWaitTime"];
            }
            if (shareFlags["eggShowInterval"] != null) {
                ShareManager.eggShowInterval = shareFlags["eggShowInterval"];
            }
            if (shareFlags["refreshBannerInterval"] != null) {
                ShareManager.refreshBannerInterval = shareFlags["refreshBannerInterval"];
            }
            if (initSuccCallBack != null) {
                initSuccCallBack();
            }
        };
        var getNewShareFlagUrl = this.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/shareFlags/" + GameConfig.versionCode + ".json";
        GameCommonHttp.wxHttpGet(getNewShareFlagUrl, callBack);
    }

    private static initIpValid() {
        //获取误点开关
        GameCommonHttp.wxHttpGet("https://ipwx.dcgstd.cn/wegame-service/api/ip/condition1", (retCode: number, retData: any) => {
            if (retCode != 0 || retData == null) {
                return;
            }
            ShareManager.ipValid = !retData.data.result;
            console.log("ip是否可以显示误触:" + ShareManager.ipValid);
        });
    }

    public static addShareInfo(shareKey: string, shareText: string, shareImgUrl: string, shareImgName: string): void {
        if (shareKey == null || shareText == null || shareImgUrl == null) {
            return;
        }
        var shareInfo = new ShareInfo(shareKey, shareText, shareImgUrl);
        shareInfo.shareImgName = shareImgName;
        if (shareKey == "high") {
            this.highShareInfos.push(shareInfo);
        } else {
            this.lowShareInfos.push(shareInfo);
        }
    }

    /**
     * 获取分享开关，当分享关闭时判断视频开关
     * @returns ShareControlType.ShareAndAdClose 分享和视频全部关闭
     * @returns ShareControlType.ShareAndAdOpen 分享和视频全部打开
     * @returns ShareControlType.ShareCloseAndAdOpen 分享关闭视频打开
     * @returns ShareControlType.VolationShareCloseAndAdOpen 违规分享关闭视频打开
     */
    public static getShareControlType(): ShareControlType {
        if (!this.masterControl) {
            return ShareControlType.ShareAndAdClose;
        }
        if (!this.shareControl) {
            return ShareControlType.ShareCloseAndAdOpen;
        }
        if (!this.volationShareControl) {
            return ShareControlType.VolationShareCloseAndAdOpen;
        }
        return ShareControlType.ShareAndAdOpen;
    }

    /**
     * 获取分享活动的开关
     * @returns 返回分享活动的开关 关闭时所有分享弹出后不再会有提示
     */
    public static getAbonormalShareControl(): boolean {
        return this.masterControl && this.abnormalShareControl;
    }

    /**
     * 获取九宫格导出的开关
     */
    public static getMoreGameControl(): boolean {
        return this.moreGameControl && this.masterControl;
    }

    /**
     * 获取轮播导出的开关
     */
    public static getCarouseControl(): boolean {
        return this.carouseControl && this.masterControl;
    }

    /**
     * 获取跑马灯导出的开关
     */
    public static getHorizontalControl(): boolean {
        return this.horizontalControl && this.masterControl;
    }

    /**
     * 获取通关导出的开关
     */
    public static getPassAllControl(): boolean {
        return this.passAllControl && this.masterControl;
    }

    /**
     * 获取全屏导出的开关
     */
    public static getFullScreenControl(): boolean {
        return this.fullScreenControl && this.masterControl;
    }

    /**
     * 获取动态图导出的开关
     */
    public static getAdFramesControl(): boolean {
        return this.adFramesControl && this.masterControl;
    }

    /**
     * 获取过关导出的开关
     */
    public static getPassPartControl(): boolean {
        return this.passPartControl && this.masterControl;
    }

    /**
     * 获取banner广告的控制开关
     */
    public static getBannerAdControl(): boolean {
        return this.bannerAdControl && this.masterControl && this.adControl;
    }

    /**
     * 获取视频广告的控制开关
     */
    public static getVideoAdControl(): boolean {
        return this.adControl;
    }

    /**
     * 获取banner广告误触的控制开关
     */
    public static getBannerMistakeControl(): boolean {
        return this.masterControl && this.bannerMistakeTouchControl && this.ipValid;
    }

    /**
     * 获取插屏广告的控制开关
     */
    public static getInterstitialAdControl(): boolean {
        return this.masterControl && this.interstitialAdControl;
    }

    /**
     * 获取复刻版审核图控制开关
     */
    public static getSpriteControl(): boolean {
        return this.spriteControl;
    }

    /**
     * 砸金蛋界面开关
     */
    public static getEggControl(): boolean {
        return this.getBannerMistakeControl() && this.eggControl;
    }

    /**
     * 获取分享信息（文案和图片链接）
     * 根据IP所在城市获取分享信息，一线城市使用高质量（正常）的分享，二线城市使用低质量（低俗）的分享
     */
    public static getCityShareInfo(): ShareInfo {
        if (!this.masterControl) {
            return this.getHighShareInfo();
        }
        if (!this.shareControl) {
            return this.getHighShareInfo();
        }
        if (!this.shareImgControl) {
            return this.getHighShareInfo();
        }
        return this.getLowShareInfo();
    }

    private static getHighShareInfo(): ShareInfo {
        let length = this.highShareInfos.length;
        if (length <= 0) {
            return this.getDefaultShareInfo();
        }
        let randomIndex = Math.round(Math.random() * (length - 1));
        return this.highShareInfos[randomIndex];
    }

    private static getLowShareInfo(): ShareInfo {
        let length = this.lowShareInfos.length;
        if (length <= 0) {
            return this.getDefaultShareInfo();
        }
        let randomIndex = Math.round(Math.random() * (length - 1));
        return this.lowShareInfos[randomIndex];
    }

    private static getDefaultShareInfo(): ShareInfo {
        return this.defaultShareInfo;
    }
}

export class ShareInfo {
    private _shareKey: string = null;
    public get shareKey(): string {
        return this._shareKey;
    }
    public set shareKey(value: string) {
        this._shareKey = value;
    }
    private _shareText: string = null;
    public get shareText(): string {
        return this._shareText;
    }
    public set shareText(value: string) {
        this._shareText = value;
    }
    private _shareImgUrl: string = null;
    public get shareImgUrl(): string {
        return this._shareImgUrl;
    }
    public set shareImgUrl(value: string) {
        this._shareImgUrl = value;
    }
    private _shareImgName: string = "默认图";
    public get shareImgName(): string {
        return this._shareImgName;
    }
    public set shareImgName(value: string) {
        this._shareImgName = value;
    }
    constructor(shareKey: string, shareText: string, shareImgUrl: string) {
        this.shareKey = shareKey;
        this.shareText = shareText;
        this.shareImgUrl = shareImgUrl;
    }
    public get convertCityText(): string {
        if (ShareManager.city == null || ShareManager.city == "null") {
            return this.shareText.replace("[城市]", "广州");
        }
        if (this.shareText != null && ShareManager.city != null) {
            return this.shareText.replace("[城市]", ShareManager.city);
        }
        return this.shareText;
    }
}

export enum ShareControlType {
    ShareAndAdClose = 1,//分享和视频全部关闭
    ShareAndAdOpen = 2,//分享和视频全部打开
    ShareCloseAndAdOpen = 3,//分享关闭视频打开
    VolationShareCloseAndAdOpen = 4,//违规分享关闭视频打开
}
