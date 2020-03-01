import { ISDK } from "./SDK/ISDK";
import { WxSDK } from "./SDK/WxSDK";
import { WebSDK } from "./SDK/WebSDK";
import { ShareManager } from "../ShareCommon/ShareManager";
import { AdManager } from "../AdManager/AdManager";
import { UserData } from "./UserData";
import { WorldEventManager } from "./WorldEventManager";
import { WorldEventType } from "./WorldEventType";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        gameCommon: GameCommon;
    }
}

@ccclass
export class GameCommon extends cc.Component {

    @property({
        displayName: "wxAppId"
    })
    protected wxAppId: string = "";

    @property({
        displayName: "游戏名称缩写"
    })
    protected appName: string = "";

    @property({
        displayName: "游戏版本号"
    })
    protected versionCode: string = "1.0.0";

    @property({
        displayName: "二级域名"
    })
    protected domainName: string = "dcgstd.cn";

    @property({
        displayName: "视频广告id"
    })
    protected videoAdUnitId: string = "";

    @property({
        displayName: "banner广告id"
    })
    protected bannerAdUnitId: string = "";

    @property({
        displayName: "插屏广告id"
    })
    protected interstitialAdUnitId: string = "";

    @property({
        displayName: "是否保存数据到服务器"
    })
    protected saveRemoteData: boolean = false;

    protected _sdk: ISDK = null;

    protected storageDataInterval: number = 0;

    public userDataInit: boolean = false;
    public shareManagerInit: boolean = false;
    protected sdkLanch: boolean = false;

    onLoad(): void {
        //把GameCommon设置成常驻节点
        cc.game.addPersistRootNode(this.node);
        window.gameCommon = this;

        GameConfig.wxAppId = this.wxAppId;
        GameConfig.wxAppName = this.appName;
        GameConfig.saveRemoteData = this.saveRemoteData;
        GameConfig.versionCode = this.versionCode;
        if (window.versionCode != null) {
            GameConfig.versionCode = window.versionCode;
        }

        if (this.domainName != null && this.domainName != "") {
            ShareManager.resetDomainName(this.domainName);
        }

        if (this.videoAdUnitId != null && this.videoAdUnitId != "") {
            GameConfig.videoAdUnitId = this.videoAdUnitId;
        }

        if (this.bannerAdUnitId != null && this.bannerAdUnitId != "") {
            GameConfig.bannerAdUnitId = this.bannerAdUnitId;
        }

        if (this.interstitialAdUnitId != null && this.interstitialAdUnitId != "") {
            GameConfig.interstitialAdUnitId = this.interstitialAdUnitId;
        }

        if (GameCommon.isWechat()) {
            //初始化微信SDK
            this._sdk = new WxSDK();
            //初始化微信数据
            this._sdk.wxInitData();
            //初始化视频广告
            AdManager.initVideoAd();
            //初始化插屏广告
            AdManager.initInterstitialAD();
        } else {
            this._sdk = new WebSDK();
        }


        var self = this;
        var initSuccCallBack = function (): void {
            console.log("ShareManager Init Call");
            self.shareManagerInit = true;
            WorldEventManager.triggerEvent(WorldEventType.GetShareFlagFinish, null);
            self.appGameLaunch();
        }

        /**
         * 初始化下载分享相关配置
         * @param wxAppId //获取分享开关以及获取分享配置需要的appId
         * @param appName //获取分享配置需要的游戏名称缩写，需要与oss上一致
         */
        ShareManager.init(initSuccCallBack);
    }

    start(): void {
        WorldEventManager.addListener(WorldEventType.GetUserDataFinish, () => {
            this.userDataInit = true;
            this.appGameLaunch();
        }, this);
    }

    update(dt: number): void {

        if (!UserData.init || this._sdk == null) {
            return;
        }

        this.storageDataInterval += dt;

        //每隔一分钟定时调用保存数据到微信本地
        if (this.storageDataInterval >= 60) {
            this._sdk.setStorage(UserData.storageKey, UserData.getJsonStr());
            this.storageDataInterval = 0;
        }
    }

    /**
     * 游戏正常启动后执行的逻辑,会在获取到用户数据和加载游戏配置数据成功后被调用
     */
    protected appGameLaunch(): void {

        if (this.shareManagerInit && !this.sdkLanch) {
            if (this._sdk) {
                this._sdk.appGameOnLanch();
            }
            this.sdkLanch = true;
        }

        if (!this.userDataInit || !this.shareManagerInit) {
            return;
        }

        WorldEventManager.triggerEvent(WorldEventType.GetAllFinish, null);
    }

    /**
     * @return ISDK
     */
    public get getSDK(): ISDK {
        return this._sdk;
    }

    public static isQQ(): boolean {

        return CC_QQPLAY;
    }

    public static isWechat(): boolean {
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    }

    public static isWeb(): boolean {
        return cc.sys.isBrowser;
    }
}

export class GameConfig {

    public static readonly DefaultChannelId: string = "dmm";

    public static wxAppId: string = "exzample_id";

    public static wxAppName: string = "exzample_name";

    public static versionCode: string = "1.0.0";

    public static videoAdUnitId: string = null;

    public static bannerAdUnitId: string = null;

    public static interstitialAdUnitId: string = null;

    public static saveRemoteData: boolean = true;
}
