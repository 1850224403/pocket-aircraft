import { WorldEventManager } from "../../../gamecommon/Script/GameCommon/WorldEventManager";
import { WorldEventType } from "../../../gamecommon/Script/GameCommon/WorldEventType";
import { LogUtil } from "../../util/LogUtil";

/*
 * @Author: FeiFan Chen 
 * @Date: 2019-11-25 19:10:02 
 * @Description: 加载界面
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-02 14:17:16
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingPanel extends cc.Component {

    @property({
        displayName: '加载进度条',
        type: cc.Sprite
    })
    private loadingProgress: cc.Sprite = null;

    private _normalSpeed: number = 0.2;

    private _normalLimit: number = 0.6;

    private _slowSpeed: number = 0.1;

    private _slowLimit: number = 0.9;

    private _fastSpeed: number = 0.6;

    private _loadingComplete: boolean = false;

    private _loadedCount: number = 0;

    private readonly _totalLoadCount: number = 4;

    public onLoad(): void {
        this._loadedCount = 0;
        this._loadingComplete = false;
        this.loadingProgress.fillRange = 0;

        this.initLoad();
    }

    private initLoad(): void {
        // 资源预加载
        appContext.resourcesManager.preloadRes()
            .then(() => this.addLoadCount())
            .catch(() => LogUtil.err('预加载资源失败！！！'));
        // 下一个场景预加载
        cc.director.preloadScene('game', null, (error: Error) => {
            if (error) {
                LogUtil.err('加载游戏场景失败');
                return;
            }
            this.addLoadCount();
        });
        // FIXME:加载配置文件
        appContext.configManager.loadAllConfig(() => this.addLoadCount());
        // FIXME:监听获取用户资源和分享开关
        WorldEventManager.addListener(WorldEventType.GetUserDataFinish, this.addLoadCount, this);
    }

    public onDestroy(): void {
        WorldEventManager.removeListener(WorldEventType.GetUserDataFinish, this.addLoadCount, this);
    }

    public update(dt: number): void {
        this.updateLoadingProgress(dt);
    }

    private updateLoadingProgress(dt: number): void {
        let targetValue = 0;
        let loadingProgress = this.loadingProgress.fillRange;
        if (this._loadingComplete) {
            targetValue = loadingProgress + dt * this._fastSpeed;
            (targetValue >= 1) && this.enterGame();
        } else if (loadingProgress < this._normalLimit) {
            targetValue = loadingProgress + dt * this._normalSpeed;
            (targetValue > this._normalLimit) && (targetValue = this._normalLimit);
        } else if (loadingProgress < this._slowLimit) {
            targetValue = loadingProgress + dt * this._slowSpeed;
            (targetValue > this._slowLimit) && (targetValue = this._slowLimit);
        }
        targetValue && (this.loadingProgress.fillRange = targetValue);
    }

    private addLoadCount(): void {
        this._loadedCount++;
        if (this._loadedCount >= this._totalLoadCount) {
            this._loadingComplete = true;
        }
    }

    private enterGame(): void {
        cc.director.loadScene('game');
    }

}