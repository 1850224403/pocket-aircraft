import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { ShareManager } from "../ShareCommon/ShareManager";

/**
 * Created by 席庆功
 * Time: 2019/06/15.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class PassMoreGameManager extends cc.Component {

    private static instance: PassMoreGameManager = null;

    @property({
        type: cc.Prefab,
        displayName: "通关盒子预设"
    })
    private passMoreGamePrefab: cc.Prefab = null;

    onLoad(): void {
        PassMoreGameManager.instance = this;
    }

    /**
     * 显示通关盒子
     */
    public static showPassMoreGame(): void {
        let manager = this.instance;
        if (manager == null) {
            return;
        }

        if (!ShareManager.getPassAllControl()) {
            return;
        }

        let moreGameNode = GameCommonPool.requestInstant(manager.passMoreGamePrefab);

        if (moreGameNode == null) {
            return;
        }

        moreGameNode.setParent(manager.node);
    }
}
