import { MoreGame } from "./MoreGame";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameConfig } from "../GameCommon/GameCommon";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { ShareManager } from "../ShareCommon/ShareManager";
import { AdManager } from "../AdManager/AdManager";
import { BackHomeMoreGame } from "./BackHomeMoreGame";
import { UserData, ExportTypeEnum } from "../GameCommon/UserData";
import { BannerOrHorizontalBoxHelper } from "../GoldenEgg/BannerOrHorizontalBoxHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export class MoreGameManager extends cc.Component {

    public static instance: MoreGameManager = null;

    private static moreGameArrayLoading: boolean = false;
    private static boyMoreGameArrayLoading: boolean = false;
    private static partMoreGameArrayLoading: boolean = false;
    private static horizontalArrayLoading: boolean = false;

    @property({
        type: cc.Prefab,
        displayName: "新导出盒子预设"
    })
    protected newMoreGamePrefab: cc.Prefab = null;

    @property({
        type: cc.Prefab,
        displayName: "返回首页盒子预设"
    })
    protected backHomeMoreGamePrefab: cc.Prefab = null;

    protected moreGameNode: cc.Node = null;

    protected newMoreGameNode: cc.Node = null;

    protected boyMoreGameNode: cc.Node = null;

    protected partMoreGameNode: cc.Node = null;

    protected backHomeMoreGameNode: cc.Node = null;

    public readonly moreGameArray: MoreGameInfo[] = new Array();

    public readonly boyMoreGameArray: MoreGameInfo[] = new Array();

    public readonly partMoreGameArray: MoreGameInfo[] = new Array();

    public readonly horizontalArray: MoreGameInfo[] = new Array();

    public clickAction: (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number) => void = null;

    onLoad(): void {
        MoreGameManager.instance = this;

        let self = this;

        this.clickAction = function (moreGameInfo: MoreGameInfo, moduleType: number, itemOrder: number): void {
            console.log(moreGameInfo);
            if (moreGameInfo == null) {
                return;
            }
            StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "playerClick", moduleType, itemOrder);
            //小游戏自带跳转
            var jumpCallBack = function (success: boolean): void {
                if (!success) {
                    //跳转失败后判断是否需要二维码跳转
                    if (moreGameInfo.switchQRCode) {
                        window.gameCommon.getSDK.previewImage(moreGameInfo.QRCode);
                    }
                    self.navigateFail(moreGameInfo);
                    return;
                }
                StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "jumpSuccess", moduleType, itemOrder);
            }
            window.gameCommon.getSDK.navigateToMiniProgram(moreGameInfo.gameAppId, moreGameInfo.jumpPath, jumpCallBack);
        }
    }

    // 跳转失败
    public navigateFail(moreGameInfo: MoreGameInfo): void {
        if (this.moreGameNode != null) {
            var moreGame = this.moreGameNode.getComponent(MoreGame);
            if (moreGame != null) {
                moreGame.navigateFail(moreGameInfo);
            }
        }
        if (this.newMoreGameNode != null) {
            var moreGame = this.newMoreGameNode.getComponent(MoreGame);
            if (moreGame != null) {
                moreGame.navigateFail(moreGameInfo);
            }
        }
        if (this.partMoreGameNode != null) {
            var moreGame = this.partMoreGameNode.getComponent(MoreGame);
            if (moreGame != null) {
                moreGame.navigateFail(moreGameInfo);
            }
        }
        if (this.boyMoreGameNode != null) {
            var moreGame = this.boyMoreGameNode.getComponent(MoreGame);
            if (moreGame != null) {
                moreGame.navigateFail(moreGameInfo);
            }
        }
    }

    /**
     * 显示新的导出盒子（大屏）
     * @param closeAction 关闭盒子的回调
     */
    public static showNewMoreGame(closeAction: () => void): void {
        BannerOrHorizontalBoxHelper.hideBanner();
        let hasConfig = this.checkMoreGameConfig();
        if (!hasConfig) {
            closeAction && closeAction();
            return;
        }

        var manager = this.instance;
        if (manager == null) {
            return;
        }

        if (!ShareManager.getFullScreenControl()) {
            closeAction && closeAction();
            return;
        }

        UserData.addModuleShows(ExportTypeEnum.NEW_MORE_GAME, 1);

        if (manager.newMoreGameNode != null) {
            var moreGame = manager.newMoreGameNode.getComponent(MoreGame);
            if (moreGame == null) {
                closeAction && closeAction();
                return;
            }
            moreGame.bindCloseAction(closeAction);
            manager.newMoreGameNode.active = true;
            return;
        }

        var instant = GameCommonPool.requestInstant(manager.newMoreGamePrefab);
        if (instant == null) {
            closeAction && closeAction();
            return;
        }
        instant.setParent(manager.node);
        manager.newMoreGameNode = instant;
        var moreGame = instant.getComponent(MoreGame);
        if (moreGame == null) {
            closeAction && closeAction();
            return;
        }
        moreGame.bindData(manager.moreGameArray, manager.clickAction);
        moreGame.bindCloseAction(closeAction);
    }

    /**
     * 显示返回首页导出盒子
     * @param backAction 返回按钮回调
     * @param homeAction 首页按钮回调
     */
    public static showBackHomeMoreGame(backAction: () => void, homeAction: () => void): void {
        BannerOrHorizontalBoxHelper.hideBanner();
        var manager = this.instance;
        if (manager == null) {
            return;
        }

        if (!ShareManager.getFullScreenControl()) {
            backAction && backAction();
            homeAction && homeAction();
            return;
        }

        if (manager.backHomeMoreGameNode != null) {
            var moreGame = manager.backHomeMoreGameNode.getComponent(BackHomeMoreGame);
            if (moreGame == null) {
                backAction && backAction();
                homeAction && homeAction();
                return;
            }
            moreGame.bindAction(backAction, homeAction);
            manager.backHomeMoreGameNode.active = true;
            return;
        }

        var instant = GameCommonPool.requestInstant(manager.backHomeMoreGamePrefab);
        if (instant == null) {
            backAction && backAction();
            homeAction && homeAction();
            return;
        }
        instant.setParent(manager.node);
        manager.backHomeMoreGameNode = instant;
        var moreGame = instant.getComponent(BackHomeMoreGame);
        if (moreGame == null) {
            backAction && backAction();
            homeAction && homeAction();
            return;
        }
        moreGame.bindAction(backAction, homeAction);
    }

    public static initMoreGameConfig(): void {
        var manager = this.instance;
        if (manager == null) {
            return;
        }

        var url = ShareManager.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/assets/" + GameConfig.versionCode + "/moreGameConfig.txt?time=" + Date.now();

        var callBack = function (retCode: number, retData: any): void {
            MoreGameManager.moreGameArrayLoading = false;
            if (retCode != 0 || retData == null) {
                return;
            }
            var moreGames = retData.moreGames;
            if (moreGames != null) {
                for (var moreGame of moreGames) {
                    if (!moreGame._jumpSwith) {
                        continue;
                    }
                    manager.addMoreGame(moreGame._name, moreGame._jumpImageUrl, moreGame._jumpAppId, moreGame._jumpPath, moreGame._jumpSwith,
                        moreGame._redDot, moreGame._QRCode, moreGame._switchQRCode, moreGame.gameDesc, moreGame.rectIconUrl, moreGame.boyGame);
                }
            }
        };
        this.moreGameArrayLoading = true;
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    public static initHorizontalConfig(): void {

        var manager = this.instance;
        if (manager == null) {
            return;
        }

        var url = ShareManager.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/assets/" + GameConfig.versionCode + "/horizontalGameConfig.txt?time=" + Date.now();

        var callBack = function (retCode: number, retData: any): void {
            MoreGameManager.horizontalArrayLoading = false;
            if (retCode != 0 || retData == null) {
                return;
            }
            var moreGames = retData.moreGames;
            if (moreGames != null) {
                for (var moreGame of moreGames) {
                    if (!moreGame._jumpSwith) {
                        continue;
                    }
                    manager.addHorizontalMoreGame(moreGame._name, moreGame._jumpImageUrl, moreGame._jumpAppId, moreGame._jumpPath, moreGame._jumpSwith,
                        moreGame._redDot, moreGame._QRCode, moreGame._switchQRCode, moreGame.gameDesc, moreGame.rectIconUrl, moreGame.boyGame);
                }
            }
        };
        this.horizontalArrayLoading = true;
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    private static checkMoreGameConfig(): boolean {
        if (this.moreGameArrayLoading) {
            return false;
        }
        var manager = this.instance;
        if (manager == null) {
            return false;
        }
        if (manager.moreGameArray == null || manager.moreGameArray.length <= 0) {
            this.initMoreGameConfig();
            return false;
        }
        return true;
    }

    private static checkHorizontalConfig(): boolean {
        if (this.horizontalArrayLoading) {
            return false;
        }
        var manager = this.instance;
        if (manager == null) {
            return false;
        }
        if (manager.horizontalArray == null || manager.horizontalArray.length <= 0) {
            this.initHorizontalConfig();
            return false;
        }
        return true;
    }

    public static getMoreGameInfo(): Array<MoreGameInfo> {
        var manager = this.instance;
        if (manager == null) {
            return null;
        }
        return manager.moreGameArray;
    }

    public static getHorizontalMoreGameInfo(): Array<MoreGameInfo> {

        this.checkHorizontalConfig();

        var manager = this.instance;
        if (manager == null) {
            return null;
        }
        return manager.horizontalArray;
    }

    public static isMoreGameShow(): boolean {
        var manager = this.instance;
        if (manager == null) {
            return false;
        }
        if (manager.newMoreGameNode && manager.newMoreGameNode.active) {
            return true;
        }
        if (manager.backHomeMoreGameNode && manager.backHomeMoreGameNode.active) {
            return true;
        }
        return false;
    }

    protected addMoreGame(gameName: string, gameIconUrl: string, gameAppId: string, jumpPath: string, switchControl: boolean, redPoint: boolean, QRCode: string,
        switchQRCode: boolean, gameDesc: string, rectIconUrl: string, boyGame: boolean): void {
        var moreGameInfo = new MoreGameInfo(gameName, gameIconUrl, gameAppId, jumpPath, switchControl, redPoint, QRCode, switchQRCode, gameDesc);
        moreGameInfo.rectIconUrl = rectIconUrl + "?time=" + Date.now();
        moreGameInfo.boyGame = boyGame;
        this.moreGameArray.push(moreGameInfo);
    }

    protected addHorizontalMoreGame(gameName: string, gameIconUrl: string, gameAppId: string, jumpPath: string, switchControl: boolean, redPoint: boolean, QRCode: string,
        switchQRCode: boolean, gameDesc: string, rectIconUrl: string, boyGame: boolean): void {
        var moreGameInfo = new MoreGameInfo(gameName, gameIconUrl, gameAppId, jumpPath, switchControl, redPoint, QRCode, switchQRCode, gameDesc);
        moreGameInfo.rectIconUrl = rectIconUrl + "?time=" + Date.now();
        moreGameInfo.boyGame = boyGame;
        this.horizontalArray.push(moreGameInfo);
    }
}

export class MoreGameInfo {
    public gameName: string;
    public gameIconUrl: string;
    public gameAppId: string;
    public jumpPath: string;
    public switchControl: boolean;
    public redPoint: boolean;
    public tryGameTime: number = 0;
    public QRCode: string = null;
    public switchQRCode: boolean = false;
    public gameDesc: string = null;
    public rectIconUrl: string = null;
    public boyGame: boolean = false;

    constructor(gameName: string, gameIconUrl: string, gameAppId: string, jumpPath: string, switchControl: boolean, redPoint: boolean, QRCode: string, switchQRCode: boolean, gameDesc: string = "") {
        this.gameName = gameName;
        this.gameIconUrl = gameIconUrl + "?time=" + Date.now();
        this.gameAppId = gameAppId;
        this.jumpPath = jumpPath;
        this.switchControl = switchControl;
        this.redPoint = redPoint;
        this.QRCode = QRCode;
        this.switchQRCode = switchQRCode;
        this.gameDesc = gameDesc;
    }
}
