import { UserData } from "../GameCommon/UserData";
import { MoreGameManager } from "../MoreGame/MoreGameManager";
import { ShareManager } from "../ShareCommon/ShareManager";
import { AdManager } from "../AdManager/AdManager";
import { LogUtil } from "../../../scripts/util/LogUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class BannerOrHorizontalBoxHelper extends cc.Component {
    public static instance: BannerOrHorizontalBoxHelper = null;
    @property(cc.Node)
    private horizontalBoxIns: cc.Node = null;
    private bannerLoadSuccess: boolean = false;

    public onLoad(): void {
        BannerOrHorizontalBoxHelper.instance = this;
    }

    /**
     *  重复时间刷新banner
     * @param bannerNodeY banner 位置高度
     * @param horizontalBoxPos 猜你喜欢位置
     */
    public static loadAndShow(bannerNodeY: number, continueRefresh: boolean = false): void {
        if (!UserData.init) {
            return;
        }
        if (bannerNodeY == null || bannerNodeY == void 0) {
            return;
        }
        if (MoreGameManager.isMoreGameShow()) {
            return;
        }
        let ins = BannerOrHorizontalBoxHelper.instance;
        if (!ins) {
            return;
        }
        let refresh = function (): void {
            // AdManager.loadBannerUpToNode(bannerNodeY, () => {
            //     AdManager.showBannerAd(() => {
            //         if (ins.horizontalBoxIns && ins.horizontalBoxIns.activeInHierarchy) {
            //             ins.horizontalBoxIns.active = false;
            //         }
            //     });

            // }, () => {
            //     AdManager.hideBannerAd(() => {
            //         if (ins.horizontalBoxIns && !ins.horizontalBoxIns.activeInHierarchy && !MoreGameManager.isMoreGameShow()) {
            //             ins.horizontalBoxIns.active = true;
            //             ins.horizontalBoxIns.setPosition(0, bannerNodeY - ins.horizontalBoxIns.height / 2);
            //         }
            //     });

            // });
            let systemInfo = window.gameCommon.getSDK.getSystemInfo();
            if (!systemInfo) {
                return;
            }

            let canvasHeight = cc.Canvas.instance.node.height;
            let tarY = bannerNodeY * systemInfo.screenHeight / canvasHeight;
            tarY = systemInfo.screenHeight * 0.5 - tarY;
            let width = systemInfo.screenWidth * 0.8;
            if (width < 300) {
                width = 300;
            }
            let left = (systemInfo.screenWidth - width) / 2;
            AdManager.loadAndShowBannerAd(left, tarY, width);
        };
        refresh();
        if (continueRefresh) {
            ins.schedule(() => {
                refresh();
            }, ShareManager.refreshBannerInterval);
        }
        else {
            ins.unscheduleAllCallbacks();
        }
    }

    /**
     * 加载banner
     */
    public static loadBanner(bannerNodeY: number): void {
        let ins = BannerOrHorizontalBoxHelper.instance;
        if (!ins) {
            return;
        }
        AdManager.loadBannerUpToNode(bannerNodeY, () => {
            ins.bannerLoadSuccess = true;
        }, () => {
            ins.bannerLoadSuccess = false;
        });
    }

    /*
     *显示banner  保证调用过一次 loadBannerOnce
     */
    public static showBanner(bannerNodeY: number): void {
        let ins = BannerOrHorizontalBoxHelper.instance;
        if (!ins) {
            return;
        }
        if (ins.bannerLoadSuccess) {
            AdManager.showBannerAd(() => {
                if (ins.horizontalBoxIns && ins.horizontalBoxIns.activeInHierarchy) {
                    ins.horizontalBoxIns.active = false;
                }
            });

        }
        else {
            AdManager.hideBannerAd(() => {
                if (ins.horizontalBoxIns && !ins.horizontalBoxIns.activeInHierarchy && !MoreGameManager.isMoreGameShow()) {
                    ins.horizontalBoxIns.active = true;
                    ins.horizontalBoxIns.setPosition(0, bannerNodeY - ins.horizontalBoxIns.height / 2);
                }
            });
        }
    }

    /**
     * 关闭banner
     */
    public static hideBanner(): void {
        //关闭banner
        AdManager.hideBannerAd(null);
        //关闭猜你喜欢
        let ins = BannerOrHorizontalBoxHelper.instance;
        if (!ins) {
            return;
        }
        ins.unscheduleAllCallbacks();
        if (ins.horizontalBoxIns && ins.horizontalBoxIns.activeInHierarchy) {
            ins.horizontalBoxIns.active = false;
        }
    }
}