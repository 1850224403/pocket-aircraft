import { HitGoldenEgg } from "./HitGoldenEgg";
import { BannerOrHorizontalBoxHelper } from "./BannerOrHorizontalBoxHelper";
import { ShareManager } from "../ShareCommon/ShareManager";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { MoreGameManager } from "../MoreGame/MoreGameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class GoldenEggHelper extends cc.Component {
    public static instance: GoldenEggHelper = null;
    private eggTimer: number = 0;
    public coinNumber: number = 100;
    private goldenEggIns: cc.Node = null;
    @property(cc.Prefab)
    private goldenEggPre: cc.Prefab = null;

    public onLoad(): void {
        GoldenEggHelper.instance = this;
    }

    public update(dt): void {
        //刷新显示砸金蛋时间
        this.eggTimer -= dt;
        if (this.eggTimer <= 0) {
            this.eggTimer = 0;
        }
    }

    /**
     * 显示砸金蛋界面
     */
    public static showGoldenEgg(successCallBack: (coinNum: number) => void, closeCallBack: () => void): void {
        if (!ShareManager.getEggControl()) {
            closeCallBack && closeCallBack();
            return;
        }
        let ins = GoldenEggHelper.instance;
        if (!ins) {
            closeCallBack && closeCallBack();
            return;
        }
        if (ins.eggTimer > 0) {
            //金蛋cd中
            closeCallBack && closeCallBack();
            return;
        }
        if (ins.goldenEggIns && ins.goldenEggIns.activeInHierarchy) {
            //已显示
            closeCallBack && closeCallBack();
            return;
        }
        if (MoreGameManager.isMoreGameShow()) {
            //全屏导出盒子在
            closeCallBack && closeCallBack();
            return;
        }
        let sameCallBack = function (): void {
            ins.eggTimer = ShareManager.eggShowInterval;
            ins.closeDialog();
        };
        //绑定数据
        let dialogBind = function (): void {
            let dialog = ins.goldenEggIns.getComponent(HitGoldenEgg);
            if (!dialog) {
                closeCallBack && closeCallBack();
                return;
            }
            //绑定数据
            dialog.bindData(ins.coinNumber, (coinNum: number) => {
                successCallBack && successCallBack(coinNum);
                sameCallBack();
            }, () => {
                closeCallBack && closeCallBack();
                sameCallBack();
            });
            if (ins.goldenEggIns.activeInHierarchy == false) {
                ins.goldenEggIns.active = true;
            }
        };
        if (ins.goldenEggIns && ins.goldenEggIns.activeInHierarchy == false) {
            dialogBind();
        }
        else {
            ins.goldenEggIns = GameCommonPool.requestInstant(ins.goldenEggPre);
            if (!ins.goldenEggIns) {
                closeCallBack && closeCallBack();
                return;
            }
            ins.goldenEggIns.setParent(ins.node);
            ins.goldenEggIns.setPosition(0, 0);
            dialogBind();
        }
    }

    /**
     * 关闭砸金蛋界面
     */
    public closeDialog(): void {
        if (!this.goldenEggIns || this.goldenEggIns.active == false) {
            return;
        }
        this.goldenEggIns.active = false;
        //关闭banner
        BannerOrHorizontalBoxHelper.hideBanner();
    }

    /**
     * 是否展示砸金蛋
     */
    public static isShowGoldenEgg(): Boolean {
        let ins = GoldenEggHelper.instance;
        if (!ins) {
            return false;
        }
        return (ins.goldenEggIns && ins.goldenEggIns.activeInHierarchy);
    }
}
