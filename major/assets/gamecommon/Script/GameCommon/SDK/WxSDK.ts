import { ISDK } from "./ISDK";
import { GameConfig } from "../GameCommon";
import { ShareManager, ShareInfo, ShareControlType } from "../../ShareCommon/ShareManager";
import { UserData } from "../UserData";
import { TipManager } from "../../Tip/TipManager";
import { GameCommonHttp } from "../GameCommonHttp";
import { StatisticsManager } from "../../StatisticsManager/StatisticsManager";
import { LaunchOption, LaunchPacket } from "../LaunchOption";
import { TaskManager } from "../TaskManager";
import { UserStorage } from "../UserStorage";
import { MultiTouchManager } from "../MultiTouchManager";

export class WxSDK implements ISDK {

    public readonly systemInfo: SystemInfo = new SystemInfo();

    private onShowCall: (res: any) => void = null;
    private onHideCall: () => void = null;

    //微信最后执行onHide的时间
    private onHideTime: number = 0;
    //微信分享对应的次数
    private shareCountMap: Map<string, number> = new Map();
    //临时微信onShow回调，调用一次后废弃
    private tempOnShowCall: (res: any) => void = null;

    private feedbackButton: any = null;

    private launchUpload: boolean = false;//是否执行过启动上传记录，默认未执行

    private levelShareFailCount: number = 0;

    private shareTime: number = 0;//点击分享的时间戳
    private shareType: string = null;//分享点击类型
    private shareInfo: ShareInfo = null;//分享点击信息

    // 是否处于分享中
    private onShare: boolean = false;

    private authorizationButton: any = null;

    constructor() {
        this.keepScreenOn();
        this.showShareMenu();
    }

    getSystemInfo(): SystemInfo {
        return this.systemInfo;
    }

    /**
     * 跳转小游戏
     * @param jumpAppId 跳转小程序的APPID
     * @param jumpPath 跳转地址
     * @param callBack 跳转成功的回调
     */
    public navigateToMiniProgram(jumpAppId: string, jumpPath: string, callBack?: (success: boolean) => void): void {

        if (typeof (wx.navigateToMiniProgram) !== 'function') {
            return;
        }

        if (jumpPath == null || jumpPath == "" || jumpPath.indexOf("?") == -1) {
            jumpPath = "?adUserAppJump=true";
        } else {
            jumpPath = jumpPath + "&adUserAppJump=true";
        }

        try {
            wx.navigateToMiniProgram({
                appId: jumpAppId,
                path: jumpPath,
                //二次跳转体验版使用 envVersion: "trial",//正式版删除
                extraData: GameConfig.wxAppId,
                success: function () {
                    if (callBack) {
                        callBack(true);
                    }
                },
                fail: function (res) {
                    if (callBack) {
                        callBack(false);
                    }
                    console.error(res)
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 微信预览图片
     * @param url 需要展示单张图片的url
     * @param urls 需要展示一组图片的url数组
     */
    previewImage(url?: string, urls?: Array<string>): void {

        if (url == null && urls == null) {
            return;
        }

        if (typeof (wx.previewImage) !== 'function') {
            return;
        }

        var imgUrls = urls || new Array();

        if (url != null) {
            imgUrls.push(url);
        }

        try {
            wx.previewImage({
                urls: imgUrls
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 显示微信意见反馈按钮
     * @param left 左上角横坐标
     * @param top 左上角纵坐标
     * @param 投诉图片的在resource文件下的位置
     */
    showFeedbackButton(left: number, top: number, imagePath: string): void {

        if (typeof wx.createFeedbackButton !== "function") {
            return;
        }

        this.destroyFeedbackButton();

        try {
            let button = wx.createFeedbackButton({
                type: 'image',
                image: imagePath,
                text: "  ",
                style: {
                    left: left,
                    top: top,
                    width: 43.8,
                    height: 22.8,
                }
            });
            button.show();
            this.feedbackButton = button;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 销毁微信意见反馈按钮
     */
    destroyFeedbackButton(): void {
        if (this.feedbackButton == null) {
            return;
        }
        this.feedbackButton.destroy();
        this.feedbackButton = null;
    }

    /**
     * 保存数据到微信中
     * @param storageKey 本地缓存中指定的 key
     * @param storageData 需要被保存的数据，暂定只保存string
     */
    public setStorage(storageKey: string, storageData: string): void {
        try {
            wx.setStorage({
                key: storageKey,
                data: storageData
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 从微信中获取数据
     * @param storageKey 本地缓存中指定的 key 
     */
    public getStorage(storageKey: string): string {
        try {
            return wx.getStorageSync(storageKey);
        } catch (error) {
            console.error(error);
        }
    }

    public vibrateShort(): void {
        if (typeof wx.vibrateShort !== "function") {
            return;
        }
        try {
            wx.vibrateShort();
        } catch (error) {
            console.error(error);
        }
    }

    public vibrateLong(): void {
        if (typeof wx.vibrateLong !== "function") {
            return;
        }
        try {
            wx.vibrateLong();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 获取微信启动参数
     * @return launchOption
     */
    getLaunchOptions(): any {
        try {
            return wx.getLaunchOptionsSync();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 注册微信游戏onShow事件,launch不会触发onShow回调
     * @param callBack 
     */
    registerOnShow(callBack: (res: any) => void): void {
        this.onShowCall = callBack;
    }

    /**
     * 注册微信游戏隐藏事件
     * @param callBack 
     */
    registerOnHide(callBack: () => void): void {
        this.onHideCall = callBack;
    }

    /**
     * 检查是否有新版本需要更新
     */
    private checkNewVersion(): void {
        if (typeof wx.getUpdateManager === 'function') {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    console.log("发现新版本");
                }
            })

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: "检测到新版本",

                    content: "新的版本已经下载好，是否立即应用新版本?",

                    success: function (res) {
                        if (res.confirm) {
                            console.log("用户选更新");
                            updateManager.applyUpdate();
                        } else if (res.cancel) {
                            console.log("用户选不更新");
                        }
                    },
                })
            })

            updateManager.onUpdateFailed(function () {
                console.warn("新版本下载失败");
            })
        } else {
            console.log("getUpdateManager 不存在");
        }
    }

    /**
    * 设置屏幕常亮 
    */
    private keepScreenOn(): void {
        if (typeof (wx.setKeepScreenOn) !== 'function') {
            return;
        }
        try {
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
    * 显示分享菜单
    */
    private showShareMenu(): void {
        if (typeof (wx.showShareMenu) !== 'function') {
            return;
        }
        try {
            wx.showShareMenu({
                withShareTicket: true
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 上传登陆记录以及获取UserStorage
     */
    uploadLoginRecord(): void {
        console.log("uploadLoginRecord");

        //首先查看本地是否有sessionKey,有的同时要checkSession是否有效
        if (UserData.data.sessionKey) {
            TaskManager.addTask(this.checkSessionTask.bind(this));
            return;
        }
        //没有sessionKey 则需要登陆获取sessionKey
        TaskManager.addTask(this.loginTask.bind(this));// 登录
    }

    uploadLoginTask(successCall: () => void, failCall: () => void): void {
        let self = this;
        //判断本地是否有userStorage
        let storageJson = this.getStorage(UserStorage.KEY);
        if (storageJson && storageJson !== "" && UserStorage.parseFromStr(storageJson)) {
            LaunchPacket.data.needUserStorage = false;
            LaunchPacket.data.needOpenId = UserData.data.openId == null;
            if (!LaunchPacket.data.needOpenId && typeof wx.aldSendOpenid === 'function') {
                wx.aldSendOpenid(UserData.data.openId);
            }
        } else {
            LaunchPacket.data.needUserStorage = true;
            LaunchPacket.data.needOpenId = true;
        }
        // 继续从LaunchOption中获取参数封装LaunchPacket
        LaunchPacket.data.uuid = UserData.data.playerId;
        LaunchPacket.data.sessionSourceAppId = LaunchOption.data.sessionSourceAppId;
        LaunchPacket.data.sourceAppId = LaunchOption.data.sourceAppId;
        LaunchPacket.data.sesseionWxAdInfo = LaunchOption.data.sesseionWxAdInfo;
        LaunchPacket.data.wxAdInfo = LaunchOption.data.wxAdInfo;
        LaunchPacket.data.scene = LaunchOption.data.scene;
        LaunchPacket.data.sharePlayerUuid = LaunchOption.data.sharePlayerUuid;
        // 上传LaunchPacket
        let url = ShareManager.newStatisticUrl + "launch/" + GameConfig.wxAppId;
        let data: any = {};
        data.needUserStorage = LaunchPacket.data.needUserStorage;
        data.needOpenId = LaunchPacket.data.needOpenId;
        data.code = LaunchPacket.data.code;
        data.uuid = LaunchPacket.data.uuid;
        data.sourceAppId = LaunchPacket.data.sourceAppId;
        data.sessionSourceAppId = LaunchPacket.data.sessionSourceAppId;
        data.wxAdInfo = LaunchPacket.data.wxAdInfo;
        data.sesseionWxAdInfo = LaunchPacket.data.sesseionWxAdInfo;
        data.sharePlayerUuid = LaunchPacket.data.sharePlayerUuid;
        data.scene = LaunchPacket.data.scene;
        data.version = GameConfig.versionCode;
        let httpCallback = (retCode: number, retData: any) => {
            if (retCode != 0) {
                failCall && failCall();
                return;
            }
            successCall && successCall();
            if (!retData || !retData.data) {
                return;
            }
            if (retData.data.sessionKey) {
                UserData.data.sessionKey = retData.data.sessionKey;
            }
            if (retData.data.userStorage) {
                UserStorage.data = retData.data.userStorage;
                self.setStorage(UserStorage.KEY, JSON.stringify(UserStorage.data));
                if (UserStorage.data.uuid) {
                    UserData.data.playerId = UserStorage.data.uuid;
                }
                if (UserStorage.data.openId) {
                    UserData.data.openId = UserStorage.data.openId;
                    if (typeof wx.aldSendOpenid === 'function') {
                        wx.aldSendOpenid(UserData.data.openId);
                    }
                }
                if (UserStorage.data.gender != null && UserData.data.gender == null) {
                    UserData.data.gender = UserStorage.data.gender;
                }
            }
            if (LaunchPacket.data.needUserStorage && UserData.data.uploadEventData != null) {
                this.uploadEvent();
            }
            TaskManager.addTask(self.getUserDataTask.bind(self));
        }
        GameCommonHttp.wxHttpPost(url, data, httpCallback);

        if (!LaunchPacket.data.needUserStorage && UserData.data.uploadEventData != null) {
            this.uploadEvent();
        }
    }

    // 检查session是否有效的任务，有效则执行上传登陆记录逻辑，无效则需要重新登陆
    checkSessionTask(successCall: () => void, failCall: () => void): void {
        console.log("checkSessionTask");
        try {
            let self = this;
            wx.checkSession({
                success() {
                    // session_key 未过期，并且在本生命周期一直有效 执行上传登陆记录逻辑
                    successCall && successCall();
                    TaskManager.addTask(self.uploadLoginTask.bind(self));
                },
                fail() {
                    // session_key 已经失效，需要重新执行登录流程
                    failCall && failCall();
                    TaskManager.addTask(self.loginTask.bind(self));// 重新登录
                }
            });
        } catch (error) {
            console.error(error);
            failCall && failCall();
        }
    }

    loginTask(successCall: () => void, failCall: () => void): void {
        console.log("loginTask");
        try {
            let self = this;
            wx.login({
                success: function (res: any): void {
                    successCall && successCall();
                    console.log("wxLogin succ  res.code is : " + res.code);
                    LaunchPacket.data.code = res.code;
                    //执行上传登陆记录逻辑
                    TaskManager.addTask(self.uploadLoginTask.bind(self));
                },

                fail: function (res: any): void {
                    failCall && failCall();
                    wx.showModal({
                        title: "登陆失败",
                        content: "请检查网络后重试~",
                        showCancel: false,
                        cancelText: "取消",
                        confirmText: "确定",
                        success: function (res: any): void {
                            if (res.confirm) {
                                TaskManager.addTask(self.loginTask.bind(self));// 重新登录
                            } else {
                                //执行上传登陆记录逻辑
                                TaskManager.addTask(self.uploadLoginTask.bind(self));
                            }
                        },
                        fail: function (): void {
                            //执行上传登陆记录逻辑
                            TaskManager.addTask(self.uploadLoginTask.bind(self));
                        }
                    });
                },
            });
        } catch (error) {
            console.error(error);
            failCall && failCall();
        }
    }

    getUserDataTask(successCall: () => void, failCall: () => void): void {
        if (UserData.init || !UserData.data.openId) {
            successCall && successCall();
            return;
        }
        //初始化玩家的数据
        let callBack = function (retCode: number, retData2: any): void {
            UserData.init = true;
            if (retCode != 0 || retData2 == null || retData2.resultCode != 0 || retData2.data == null || retData2.data.info == null) {
                failCall && failCall();
                return;
            }
            successCall && successCall();
            console.log("resData info :" + retData2.data.info);
            UserData.parseFromStr(retData2.data.info);
        }
        let url = ShareManager.dataStorageUrl + "/getUserInfo" + '?appId=' + GameConfig.wxAppId + '&openId=' + UserData.data.openId;
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    saveUserDataTask(successCall: () => void, failCall: () => void): void {
        if (!GameConfig.saveRemoteData || !GameConfig.wxAppId || !UserData.data.openId) {
            successCall && successCall();
            return;
        }
        let userDataStr = UserData.getJsonStr();
        let data: any = {};
        data.appId = GameConfig.wxAppId;
        data.openId = UserData.data.openId;
        data.info = userDataStr;
        let url: string = ShareManager.dataStorageUrl + "/saveUserInfo";
        GameCommonHttp.wxHttpPost(url, data, (retCode: number, retData: any) => {
            console.log("get user data retCode:" + retCode);
            console.log("get user data retData: ", retData);
            if (retCode == 0) {
                successCall && successCall();
            } else {
                failCall && failCall();
            }
        });
    }

    uploadEvent(): void {

        let data = UserData.getUploadEventData();

        if (!UserStorage.data) {
            return;
        }

        let uploadEventTask = function (successCall: () => void, failCall: () => void): void {
            let url: string = ShareManager.newStatisticUrl + "upload/" + GameConfig.wxAppId;
            GameCommonHttp.wxHttpPost(url, data, (retCode: number, retData: any) => {
                if (retCode == 0) {
                    UserData.data.uploadEventData = null;
                    successCall && successCall();
                } else {
                    failCall && failCall();
                }
            });
        }

        TaskManager.addTask(uploadEventTask.bind(this));
    }

    /**
     * 游戏启动，确保最多只执行一次
     */
    appGameOnLanch(): void {

        if (this.launchUpload) {
            return;
        }
        this.launchUpload = true;

        let res = this.getLaunchOptions();
        if (!res || !res.query) {
            // 上传启动记录
            this.uploadLoginRecord();
            return;
        }

        let query = res.query;
        let scene = res.scene;

        //保存启动参数
        let launchOption = LaunchOption.data;
        launchOption.sessionSourceAppId = query.sessionSourceAppId;
        launchOption.scene = scene;

        // 获取广告相关参数
        launchOption.wxAdInfo = query.weixinadinfo;
        launchOption.sesseionWxAdInfo = query.sesseionWxAdInfo;

        if (query.sharePlayerId != null) {
            launchOption.sharePlayerUuid = query.sharePlayerId;
        }

        if (UserData.newUser && query.uuid != null) {
            UserData.data.playerId = query.uuid;
        }

        //获取启动参数并执行onShow
        this.onShow(res);

        let sourceAppId = res.referrerInfo ? res.referrerInfo.appId : null;
        let extraDataAppId = res.referrerInfo && res.referrerInfo.extraData ? res.referrerInfo.extraData.appid : null;

        if (sourceAppId != null) {
            if (extraDataAppId == GameConfig.wxAppId) {
                sourceAppId = extraDataAppId;
            }
        }

        if (sourceAppId == null && query.sappid) {
            sourceAppId = query.sappid;
        }

        //记录玩家数据并保存起来
        launchOption.sourceAppId = sourceAppId;

        console.log("appGameOnLanch");

        // 上传启动记录
        this.uploadLoginRecord();
    }

    public wxInitData(): void {

        var self = this;

        this.wxGetSystemInfo();

        var jsonDataStr = window.gameCommon.getSDK.getStorage(UserData.storageKey);
        if (jsonDataStr && jsonDataStr !== "") {
            UserData.parseFromStr(jsonDataStr);
        }

        if (!GameConfig.saveRemoteData) {
            UserData.init = true;
        }

        //监听用户点击右上角菜单的“转发”按钮时触发的事件
        let shareAppMessageFunc = function (res) {

            var shareInfo = ShareManager.getCityShareInfo();

            self.shareTime = Date.now();
            self.shareType = "右上角分享";
            self.shareInfo = shareInfo;
            self.onShare = true;

            StatisticsManager.thirdSendEvent("右上角分享");

            var shareMsg = shareInfo.convertCityText;

            var shareUrl = shareInfo.shareImgUrl;

            var extendInfo = "&shareType=右上角分享";
            extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
            extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
            extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;

            if (GameGlobal && GameGlobal.tdAppSdk && typeof GameGlobal.tdAppSdk.share === 'function') {
                GameGlobal.tdAppSdk.share({
                    title: shareMsg,
                    path: shareUrl + "?timestate=" + self.shareTime
                });
            }

            return {
                title: shareMsg,

                imageUrl: shareUrl + "?timestate=" + self.shareTime,

                query: self.getQueryParam(extendInfo),

                ald_desc: "右上角分享"
            }
        }
        if (typeof wx.aldOnShareAppMessage !== 'function') {
            wx.onShareAppMessage(shareAppMessageFunc);
        } else {
            wx.aldOnShareAppMessage(shareAppMessageFunc);
        }

        //添加最小化游戏时上传客户端事件
        wx.onHide(function () {
            console.log("hide call");
            self.onHideTime = Date.now();
            try {
                if (self.onHideCall != null) {
                    self.onHideCall();
                }
            } catch (error) {
                console.log(error);
            }
            if (UserData.lastOnShowTime != 0) {
                UserData.data.stayTime = Math.round((Date.now() - UserData.lastOnShowTime) / 1000);
                UserData.lastOnShowTime = 0;
            }
            self.uploadEvent();
            self.setStorage(UserData.storageKey, UserData.getJsonStr());
            TaskManager.addTask(self.saveUserDataTask.bind(self));
        });

        //添加监听wx的onShow
        wx.onShow(function (res) {
            try {
                //重置禁用多点触摸组件的状态，以防止不能点击的bug
                MultiTouchManager.resetCurrentTouchInfo();

                if (self.onShare) {
                    self.onShare = false;
                    let intervlaTime = Date.now() - self.onHideTime;
                    if (intervlaTime >= 3000) {
                        UserData.data.shareSuccess++;
                        UserData.userActions.shareSuccess++;
                    }
                }

                if (self.tempOnShowCall != null) {
                    self.tempOnShowCall(res);
                    self.tempOnShowCall = null;
                }
                if (self.onShowCall != null) {
                    self.onShowCall(res);
                }
            } catch (error) {
                console.log(error);
            }
            self.onShow(res);
        });
    }

    private onShow(res: any): void {

        UserData.lastOnShowTime = Date.now();

        let self = this;

        //判断是否要上传分享图片统计
        if (this.shareTime != 0) {
            let shareIntervalTime = Date.now() - this.shareTime;
            if (shareIntervalTime >= 2000) {
                StatisticsManager.uploadSharePictureRecord(this.shareType, this.shareInfo, self.systemInfo.brand + self.systemInfo.model + self.systemInfo.system);
            }
            this.shareTime = 0;
        }

        if (res == null) {
            return;
        }

        console.log(res);

        let scene = res.scene;
        let query = res.query;

        console.log(query);

        if (query == null) {
            return;
        }

        //上传从卡片进来的分享统计
        var sharePlayerId = query.sharePlayerId;
        if (sharePlayerId != null && sharePlayerId != UserData.data.playerId) {
            var shareType = query.shareType;
            var shareImgName = query.shareImgName;
            var shareText = query.shareText;
            var shareImgUrl = query.shareImgUrl;
            var shareTime = query.dmmShareTime;
            if (shareType != null && shareImgName != null && shareText != null && shareImgUrl != null && shareTime != null) {
                StatisticsManager.uploadClickPictureRecord(shareType, shareImgName, shareText, shareImgUrl, shareTime, this.systemInfo.brand + this.systemInfo.model + this.systemInfo.system);
            }
        }
    }

    share(shareType: string, assistActivityId: string, extendInfos: Map<string, string>, callBack: (res: any, success: boolean) => void, tripleLie: boolean): void {

        var shareInfo = ShareManager.getCityShareInfo();

        if (shareInfo == null) {
            return;
        }

        this.shareTime = Date.now();
        this.shareType = shareType;
        this.shareInfo = shareInfo;

        var extendInfo = "";

        if (shareType != null) {
            extendInfo = "&shareType=" + shareType;
        }

        extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
        extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
        extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;

        if (extendInfos != null) {
            extendInfos.forEach((v, k) => {
                extendInfo = extendInfo + "&" + k + "=" + v;
            });
        }

        var shareMsg = shareInfo.convertCityText;

        var shareUrl = shareInfo.shareImgUrl;

        this.baseShareMsg(shareMsg, shareUrl, extendInfo, shareType);

        if (!tripleLie) {
            StatisticsManager.thirdSendEvent(shareType);
            return;
        }

        let shareControlType = ShareManager.getShareControlType();
        if (shareControlType == ShareControlType.ShareAndAdClose || shareControlType == ShareControlType.ShareCloseAndAdOpen) {
            callBack && callBack(null, true);
            return;
        }

        var shareCount = this.shareCountMap.has(shareType) ? this.shareCountMap.get(shareType) : 0;
        shareCount = shareCount % 3;
        if (shareCount == 0) {
            this.tempOnShowCall = () => {
                StatisticsManager.thirdSendEvent(shareType + "_第1次分享");
                this.shareCountMap.set(shareType, 1);
                if (ShareManager.getAbonormalShareControl()) {
                    TipManager.showTip("请换个群试试哦~");
                }
                callBack(null, false);
            }
        } else if (shareCount == 1) {
            this.tempOnShowCall = (res: any) => {
                StatisticsManager.thirdSendEvent(shareType + "_第2次分享");
                var intervalTime = Date.now() - this.onHideTime;
                if (intervalTime >= 3000) {
                    this.shareCountMap.set(shareType, 2);
                    StatisticsManager.thirdSendEvent(shareType + "_第2次分享成功");
                    callBack(null, true);
                } else {
                    if (ShareManager.getAbonormalShareControl()) {
                        TipManager.showTip("短时间内，不要分享同一个群");
                    }
                    callBack(null, false);
                }
            }
        } else {
            this.tempOnShowCall = (res: any) => {
                StatisticsManager.thirdSendEvent(shareType + "_第3次分享");
                var intervalTime = Date.now() - this.onHideTime;
                if (intervalTime >= 3000) {
                    this.shareCountMap.set(shareType, 0);
                    StatisticsManager.thirdSendEvent(shareType + "_第3次分享成功");
                    callBack(null, true);
                } else {
                    if (ShareManager.getAbonormalShareControl()) {
                        TipManager.showTip("短时间内，不要分享同一个群");
                    }
                    callBack(null, false);
                }
            }
        }
    }

    /**
     * 分级分享（失败后通用组件不做提示，提示逻辑自己写）
     * （1）新玩家（分享成功 0 - 20 次）
     * 分享成功：2 秒内返回失败、2 秒后返回成功；
     * （2）中等玩家（分享成功 21 - 60 次）
     * 第 1 - 4 次分享：3 秒内返回失败、3 秒后返回成功；
     * 第 5 次分享及以后：2 秒内返回失败、2 秒后返回成功；
     * （3）老玩家（分享成功 60 次）
     * 第 1 - 4 次分享：5 秒内返回失败、5 秒后返回成功；
     * 第 5 次分享及以后：2 秒内返回失败、2 秒后返回成功；
     * 
     * @param shareType 分享类型
     * @param callBack: (success: boolean, cancel: boolean) => void
     */
    levelShare(shareType: string, callBack: (success: boolean, cancel: boolean) => void): void {

        let shareControlType = ShareManager.getShareControlType();
        if (shareControlType == ShareControlType.ShareAndAdClose || shareControlType == ShareControlType.ShareCloseAndAdOpen) {
            callBack && callBack(true, true);
            return;
        }

        var shareInfo = ShareManager.getCityShareInfo();

        if (shareInfo == null) {
            return;
        }

        this.shareTime = Date.now();
        this.shareType = shareType;
        this.shareInfo = shareInfo;

        var extendInfo = "";

        if (shareType != null) {
            extendInfo = "&shareType=" + shareType;
        }

        extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
        extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
        extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;

        var shareMsg = shareInfo.convertCityText;

        var shareUrl = shareInfo.shareImgUrl;

        this.baseShareMsg(shareMsg, shareUrl, extendInfo, shareType);

        if (!ShareManager.getAbonormalShareControl()) {
            this.tempOnShowCall = () => {
                callBack(true, true);
            }
            return;
        }

        this.tempOnShowCall = (res: any) => {
            let succ = false;
            let intervalTime = Date.now() - this.onHideTime;
            let succCount = UserData.data.levelShareSuccCount;
            if (intervalTime >= 2000) {
                if (succCount < 2) {
                    succ = true;
                } else if (succCount < 5) {
                    succ = this.levelShareFailCount >= 4 || intervalTime >= 3000;
                } else {
                    succ = this.levelShareFailCount >= 4 || intervalTime >= 5000;
                }
            }
            if (succ) {
                UserData.data.levelShareSuccCount++;
                this.levelShareFailCount = 0;
                StatisticsManager.thirdSendEvent(shareType + "分享成功");
                callBack(true, true);
            } else {
                this.levelShareFailCount++;
                StatisticsManager.thirdSendEvent(shareType + "分享失败");
                callBack(false, true);
            }
        }
    }

    clearTripleLie(shareType: string): void {
        if (shareType == null) {
            return;
        }
        this.shareCountMap.delete(shareType);
    }

    private baseShareMsg(title: string, imageUrl: string, queryParam: string, desc: string): void {

        this.onShare = true;

        let shareAppMessageParam = {

            title: title,

            imageUrl: imageUrl,

            query: this.getQueryParam(queryParam)
        };

        if (GameGlobal && GameGlobal.tdAppSdk && typeof GameGlobal.tdAppSdk.share === 'function') {
            GameGlobal.tdAppSdk.share({
                title: title,
                path: imageUrl
            });
        }

        if (typeof wx.aldShareAppMessage !== 'function') {
            wx.shareAppMessage(shareAppMessageParam);
            return;
        }

        let aldShareAppMessageParam = {

            title: title,

            imageUrl: imageUrl,

            ald_desc: desc,

            query: this.getQueryParam(queryParam)
        }

        wx.aldShareAppMessage(aldShareAppMessageParam);
    }

    private getQueryParam(param: string) {

        var queryParam = "sharePlayerId=" + UserData.data.playerId + "&channelId=" + GameConfig.DefaultChannelId + "&dmmShareTime=" + this.shareTime;

        if (UserStorage.data != null) {
            queryParam = queryParam + "&sessionSourceAppId=" + UserStorage.data.sourceAppId + "&sesseionWxAdInfo=" + UserStorage.data.wxAdInfo;
        }

        if (param != null) {
            queryParam = queryParam + "&" + param;
        }

        return queryParam;
    }

    isPhoneXScreen(): boolean {

        if (this.systemInfo == null) {
            return false;
        }

        var width = this.systemInfo.screenWidth;
        var height = this.systemInfo.screenHeight;

        return width / height > 2 || height / width > 2
    }

    showWxModal(title: string, content: string, confirmAction: () => void, cancelAction: () => void): void {
        try {
            wx.showModal({
                title: title,
                content: content,
                showCancel: cancelAction != null,
                cancelText: "取消",
                confirmText: "确定",
                success: function (res: any): void {
                    if (res.confirm && confirmAction) {
                        confirmAction();
                    }
                    if (res.cancel && cancelAction) {
                        cancelAction();
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    getMenuButtonBoundingClientRect(): any {
        if (typeof (wx.getMenuButtonBoundingClientRect) !== "function") {
            return null;
        }
        try {
            return wx.getMenuButtonBoundingClientRect();
        } catch (error) {
            console.error(error);
        }
    }

    showWxLoading(title: string, callBack: any, delayTime: number): void {
        if (typeof (wx.showLoading) !== "function") {
            return;
        }
        try {
            wx.showLoading({
                title: title,
            });

            setTimeout(function () {
                wx.hideLoading();
                if (callBack != null) {
                    callBack();
                }
            }, delayTime);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 弹出微信授权按钮
     * @param successCall: (userInfo: any) => void 授权成功后的回调玩家的用户信息 参考wx
     * @param imagePath 按钮的背景图片地址，默认是'img/startGameButton.png'
     * @param style 按钮的样式 {left: 0,top: 0,width: width,height: height}
     */
    popWxAuthorization(successCall: (userInfo: any) => void, imagePath?: string, style?: any): void {
        try {
            // 老版本直接弹出授权
            if (typeof wx.createUserInfoButton !== 'function') {
                let self = this;
                wx.getSetting({
                    success(res) {
                        if (res == null || res.authSetting == null || res.authSetting['scope.userInfo'] == null) {
                            //没有授权，能显示授权弹窗
                            wx.authorize({
                                scope: 'scope.userInfo',
                                success: function (res) {
                                    console.log(res);
                                    self.getUserInfo(successCall);
                                },
                            });
                        }
                    },
                });
                return;
            }

            // 新版本弹出授权按钮
            this.destroyAuthorizationButton();
            let width = this.systemInfo && this.systemInfo.screenWidth;
            let height = this.systemInfo && this.systemInfo.screenHeight;
            this.authorizationButton = wx.createUserInfoButton({
                type: 'image',
                image: imagePath ? imagePath : 'img/startGameButton.png',
                style: style ? style : { left: 0, top: 0, width: width, height: height }
            });
            if (!this.authorizationButton) {
                return;
            }
            this.authorizationButton.onTap((res: any) => {
                this.destroyAuthorizationButton();
                let userInfo = res && res.userInfo
                if (userInfo != null) {
                    UserData.data.gender = userInfo.gender;
                }
                successCall && successCall(userInfo);
            });
        } catch (error) {
            this.destroyAuthorizationButton();
            console.error(error);
        }
    }

    // 销毁授权按钮
    private destroyAuthorizationButton(): void {
        try {
            if (!this.authorizationButton) {
                return;
            }
            this.authorizationButton.destroy();
            this.authorizationButton = null;
        } catch (error) {
            this.authorizationButton = null;
            console.error(error);
        }
    }

    private getUserInfo(successCall: (userInfo: any) => void): void {
        try {
            if (typeof wx.getUserInfo != "function") {
                return;
            }
            wx.getUserInfo({
                success(res) {
                    let userInfo = res && res.userInfo;
                    if (userInfo != null) {
                        UserData.data.gender = userInfo.gender;
                    }
                    successCall && successCall(userInfo);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    private wxGetSystemInfo(): void {
        try {
            var self = this;
            let failCount = 0;
            let call = () => {
                wx.getSystemInfo({
                    success(systemInfo) {
                        console.log(systemInfo);
                        self.systemInfo.platform = systemInfo.platform;
                        self.systemInfo.system = systemInfo.system;
                        self.systemInfo.brand = systemInfo.brand;
                        self.systemInfo.model = systemInfo.model;
                        self.systemInfo.screenWidth = systemInfo.screenWidth;
                        self.systemInfo.screenHeight = systemInfo.screenHeight;
                        self.systemInfo.windowWidth = systemInfo.windowWidth;
                        self.systemInfo.windowHeight = systemInfo.windowHeight;
                        self.systemInfo.benchmarkLevel = systemInfo.benchmarkLevel;
                        self.systemInfo.wechatVersion = systemInfo.version;
                        self.systemInfo.SDKVersion = systemInfo.SDKVersion;
                        self.systemInfo.pixelRatio = systemInfo.pixelRatio;
                    },
                    fail() {
                        failCount++;
                        //限制最多失败5次后不再调用
                        if (failCount >= 5) {
                            console.error("wx.getSystemInfo fail 5");
                            return;
                        } else {
                            call();
                        }
                    }
                });
            };
            call();
        } catch (error) {
            console.error(error);
        }
    }
}

export class SystemInfo {
    public platform: string;
    public system: string;//操作系统版本
    public brand: string;//手机品牌
    public model: string;//手机型号
    public screenWidth: number = 0;
    public screenHeight: number = 0;
    public windowWidth: number = 0;
    public windowHeight: number = 0;
    public benchmarkLevel: number = 0;
    public wechatVersion: string;
    public SDKVersion: string;
    public pixelRatio: number = 0;
}
