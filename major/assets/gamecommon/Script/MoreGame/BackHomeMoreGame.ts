import { ShareManager } from "../ShareCommon/ShareManager";
import { GameConfig } from "../GameCommon/GameCommon";
import { MoreGameInfo } from "./MoreGameManager";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { ExportTypeEnum, UserData } from "../GameCommon/UserData";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { HomeGameItem } from "./HomeGameItem";

/**
 * Created by 席庆功
 * Time: 2019/08/06.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BackHomeMoreGame extends cc.Component {

    @property({
        type: cc.Prefab,
        displayName: "游戏元素预设",
    })
    protected moreGameItemPrefab: cc.Prefab = null;

    @property({
        type: cc.Node,
        displayName: "上界面容器",
    })
    protected upContent: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "下界面容器",
    })
    protected downContent: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "背景",
    })
    protected bg: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "界面",
    })
    protected board: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "按钮",
    })
    protected btnNode: cc.Node = null;

    protected moreGameArrayLoading: boolean = false;

    protected readonly moreGameArray: MoreGameInfo[] = new Array();

    protected clickAction: (moreGameInfo: MoreGameInfo, itemOrder: number) => void = null;

    protected backAction: () => void = null;

    protected homeAction: () => void = null;

    protected show: boolean = false;

    protected originalPosition: cc.Vec2 = null;

    protected originalWidth: number = 0;

    protected currentGender: number = null;

    protected readonly itemArrays: Array<cc.Node> = [];

    onLoad(): void {
        this.clickAction = function (moreGameInfo: MoreGameInfo, itemOrder: number): void {
            if (moreGameInfo == null) {
                return;
            }
            StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "playerClick", ExportTypeEnum.BACK_HOME_MORE_GAME, itemOrder);
            //小游戏自带跳转
            let jumpCallBack = function (success: boolean): void {
                if (!success) {
                    //跳转失败后判断是否需要二维码跳转
                    if (moreGameInfo.switchQRCode) {
                        window.gameCommon.getSDK.previewImage(moreGameInfo.QRCode);
                    }
                    return;
                }
                StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "jumpSuccess", ExportTypeEnum.BACK_HOME_MORE_GAME, itemOrder);
            }
            window.gameCommon.getSDK.navigateToMiniProgram(moreGameInfo.gameAppId, moreGameInfo.jumpPath, jumpCallBack);
        }

        this.originalPosition = this.board.position.clone();
        this.originalWidth = this.board.width;
    }

    onEnable(): void {
        this.checkMoreGameConfig();
        this.board.stopAllActions();
        this.board.x = -this.originalWidth;
        this.showMoreGame();

        UserData.addModuleShows(ExportTypeEnum.BACK_HOME_MORE_GAME, 1);
    }

    onDisable(): void {
        this.show = false;
    }

    update(dt: number): void {
        if (this.moreGameArray == null || this.moreGameArray.length <= 0) {
            return;
        }
        // 检测到是男性用户时,需要显示男性游戏
        if (this.currentGender != UserData.data.gender && UserData.data.gender == 1) {
            this.currentGender = UserData.data.gender;
            this.showBoyGame();
        }
    }

    protected initBackHomeMoreGame(): void {
        let self = this;
        let url = ShareManager.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/assets/" + GameConfig.versionCode + "/backHomeMoreGameConfig.txt?time=" + Date.now();
        let callBack = function (retCode: number, retData: any): void {
            self.moreGameArrayLoading = false;
            if (retCode != 0 || retData == null) {
                return;
            }
            let moreGames = retData.moreGames;
            if (moreGames != null) {
                for (let moreGame of moreGames) {
                    if (!moreGame._jumpSwith) {
                        continue;
                    }
                    self.addMoreGame(moreGame._name, moreGame._jumpImageUrl, moreGame._jumpAppId, moreGame._jumpPath, moreGame._jumpSwith,
                        moreGame._redDot, moreGame._QRCode, moreGame._switchQRCode, moreGame.gameDesc, moreGame.rectIconUrl, moreGame.boyGame);
                }
            }

            self.initMoreGameItems();
        };
        this.moreGameArrayLoading = true;
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    protected checkMoreGameConfig(): void {
        if (this.moreGameArrayLoading) {
            return;
        }
        if (this.moreGameArray == null || this.moreGameArray.length <= 0) {
            this.initBackHomeMoreGame();
        }
    }

    protected addMoreGame(gameName: string, gameIconUrl: string, gameAppId: string, jumpPath: string, switchControl: boolean, redPoint: boolean, QRCode: string,
        switchQRCode: boolean, gameDesc: string, rectIconUrl: string, boyGame: boolean): void {
        let moreGameInfo = new MoreGameInfo(gameName, gameIconUrl, gameAppId, jumpPath, switchControl, redPoint, QRCode, switchQRCode, gameDesc);
        moreGameInfo.rectIconUrl = rectIconUrl + "?time=" + Date.now();
        moreGameInfo.boyGame = boyGame;
        this.moreGameArray.push(moreGameInfo);
    }

    protected initMoreGameItems(): void {
        if (this.moreGameArray == null || this.moreGameArray.length <= 0) {
            return;
        }

        for (let i = 0; i < 8; i++) {
            let gameInfo = this.moreGameArray[i];
            if (gameInfo == null) {
                return;
            }
            let gameItemNode = GameCommonPool.requestInstant(this.moreGameItemPrefab);
            if (gameItemNode == null) {
                continue;
            }
            gameItemNode.setParent(this.upContent);
            let gameItem = gameItemNode.getComponent(HomeGameItem);
            if (gameItem == null) {
                continue;
            }
            gameItem.bindData(gameInfo, i + 1, this.clickAction);
            gameItemNode.active = !gameInfo.boyGame;
            this.itemArrays.push(gameItemNode);
        }

        for (let i = 8; i < this.moreGameArray.length; i++) {
            let gameInfo = this.moreGameArray[i];
            if (gameInfo == null) {
                return;
            }
            let gameItemNode = GameCommonPool.requestInstant(this.moreGameItemPrefab);
            if (gameItemNode == null) {
                continue;
            }
            gameItemNode.setParent(this.downContent);
            let gameItem = gameItemNode.getComponent(HomeGameItem);
            if (gameItem == null) {
                continue;
            }
            gameItem.bindData(gameInfo, i + 1, this.clickAction);
            gameItemNode.active = !gameInfo.boyGame;
            this.itemArrays.push(gameItemNode);
        }
    }

    protected showMoreGame(): void {
        if (this.show) {
            return;
        }
        this.btnNode.opacity = 0;
        this.show = true;
        let self = this;
        this.board.runAction(cc.sequence(
            cc.moveTo(0.5, this.originalPosition).easing(cc.easeQuarticActionOut()),
            cc.callFunc(function () {
                self.btnNode.runAction(cc.fadeIn(0.3));
            })
        ));
        this.bg.opacity = 0;
        this.bg.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.fadeIn(0.5)
        ));
    }

    protected showBoyGame(): void {
        for (let item of this.itemArrays) {
            if (item == null) {
                continue;
            }
            item.active = true;
        }
    }

    public bindAction(backAction: () => void, homeAction: () => void): void {
        this.backAction = backAction;
        this.homeAction = homeAction;
    }

    protected clickBack(): void {
        this.node.active = false;
        this.backAction && this.backAction();
    }

    protected clickHome(): void {
        this.node.active = false;
        this.homeAction && this.homeAction();
    }
}
