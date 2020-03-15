import { WorldEventManager } from "../../gamecommon/Script/GameCommon/WorldEventManager";
import { WorldEventType } from "../../gamecommon/Script/GameCommon/WorldEventType";
import { UserData } from "../../gamecommon/Script/GameCommon/UserData";
import { MoreGameManager } from "../../gamecommon/Script/MoreGame/MoreGameManager";
import { LogUtil } from "../util/LogUtil";

/*
 * @Author: Feifan Chen
 * @Date: 2019-11-13 14:07:47
 * @Description: 等待用户数据
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-12 00:05:35
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class LoadUserData extends cc.Component {

    protected runTime: number = 0;

    public update(dt: number): void {
        if (CC_DEV) {
            this.loadUserDataComplete();
            return;
        }

        this.runTime += dt;

        //5秒后自动超时结束转圈
        if (this.runTime >= 5) {
            this.loadUserDataComplete();
            return;
        }

        if (!UserData.init) {
            this.loadUserDataComplete();
            return;
        }
    }

    private loadUserDataComplete(): void {
        //MoreGameManager.initBoyMoreGameConfig();
        MoreGameManager.initMoreGameConfig();
        MoreGameManager.initHorizontalConfig();
        //MoreGameManager.initPartMoreGameConfig();
        WorldEventManager.triggerEvent(WorldEventType.GetUserDataFinish, null);
        LogUtil.log('数据加载完成');
        appContext.userDataStorage.init();
        this.node.active = false;
    }

}