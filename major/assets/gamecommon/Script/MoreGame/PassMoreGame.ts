import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { PassMoreGameItem } from "./PassMoreGameItem";
import { GameConfig } from "../GameCommon/GameCommon";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { MoreGameInfo } from "./MoreGameManager";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { AdManager } from "../AdManager/AdManager";
import { ExportTypeEnum, UserData } from "../GameCommon/UserData";
import { ShareManager } from "../ShareCommon/ShareManager";

/**
 * Created by 席庆功
 * Time: 2019/06/15.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class PassMoreGame extends cc.Component {

    @property({
        type: cc.Node,
        displayName: "上面板"
    })
    private upBoard: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "下面板"
    })
    private downBoard: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "关闭按钮"
    })
    private closeNode: cc.Node = null;

    @property({
        type: [PassMoreGameItem],
        displayName: "导出游戏组"
    })
    private exportGames: PassMoreGameItem[] = [];

    private upOrignalPos: cc.Vec2 = null;
    private downOrignalPos: cc.Vec2 = null;

    private firstGameAction: (moreGameInfo: MoreGameInfo) => void = null;
    private firstMoreGameInfo: MoreGameInfo = null;

    onLoad(): void {

        this.upOrignalPos = this.upBoard.position;
        this.downOrignalPos = this.downBoard.position;

        this.exportGames.forEach(game => {
            if (game && game.node) {
                game.node.active = false;
            }
        });
    }

    onEnable(): void {

        AdManager.hideBannerAd();

        if (this.firstGameAction == null) {
            this.initPassMoreGame();
        }

        this.upBoard.stopAllActions();
        this.upBoard.position = this.upOrignalPos.sub(cc.v2(640, 0));
        this.upBoard.stopAllActions();
        this.downBoard.position = this.downOrignalPos.sub(cc.v2(640, 0));
        this.closeNode.active = false;

        this.upBoard.runAction(cc.spawn(
            cc.moveTo(0.5, this.upOrignalPos),
            cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(() => {
                    this.downBoard.runAction(cc.sequence(
                        cc.moveTo(0.4, this.downOrignalPos),
                        cc.callFunc(() => {
                            this.closeNode.active = true;
                            this.closeNode.stopAllActions();
                            this.closeNode.opacity = 0;
                            this.closeNode.runAction(cc.fadeIn(0.2));
                        })
                    ))
                })
            )
        ));

        UserData.addModuleShows(ExportTypeEnum.PASS_MORE_GAME, 1);
    }

    private initPassMoreGame(): void {

        let self = this;

        var url = ShareManager.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/assets/" + GameConfig.versionCode + "/passMoreGameConfig.txt?time=" + Date.now();

        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null) {
                return;
            }
            var moreGames = retData.moreGames;
            if (moreGames != null) {
                let index = 0;
                for (var moreGame of moreGames) {
                    let passGameItem = self.exportGames[index];
                    if (!moreGame._jumpSwith || passGameItem == null) {
                        continue;
                    }

                    var addMoreGameInfo = new MoreGameInfo(moreGame._name, moreGame._jumpImageUrl, moreGame._jumpAppId, moreGame._jumpPath, moreGame._jumpSwith, moreGame._redDot, moreGame._QRCode, moreGame._switchQRCode);
                    let clickAction = function (moreGameInfo: MoreGameInfo): void {
                        if (moreGameInfo == null) {
                            return;
                        }
                        StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "playerClick", ExportTypeEnum.PASS_MORE_GAME);
                        //小游戏自带跳转
                        var jumpCallBack = function (success: boolean): void {
                            if (!success) {
                                //跳转失败后判断是否需要二维码跳转
                                if (moreGameInfo.switchQRCode) {
                                    window.gameCommon.getSDK.previewImage(moreGameInfo.QRCode);
                                }
                                return;
                            }
                            StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "jumpSuccess", ExportTypeEnum.PASS_MORE_GAME);
                        }
                        window.gameCommon.getSDK.navigateToMiniProgram(moreGameInfo.gameAppId, moreGameInfo.jumpPath, jumpCallBack);
                    }

                    passGameItem.node.active = true;
                    passGameItem.bindData(addMoreGameInfo, clickAction);

                    if (index == 0) {
                        self.firstGameAction = clickAction;
                        self.firstMoreGameInfo = addMoreGameInfo;
                    }

                    index++;
                }
            }
        };
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    private cliclGoonGame(): void {
        if (this.firstGameAction) {
            this.firstGameAction(this.firstMoreGameInfo);
        }
    }

    private clickClose(): void {
        GameCommonPool.returnInstant(this.node);
    }
}
