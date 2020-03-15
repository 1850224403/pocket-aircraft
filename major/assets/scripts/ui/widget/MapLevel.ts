import { LevelNumber } from "../../entity/LevelNumber";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-13 15:22:55 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-02-06 09:41:36
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class MapLevel extends cc.Component {

    @property({
        displayName: '关卡数',
        type: LevelNumber,
    })
    private levelNumber: LevelNumber = null;

    private _mapLevel: number = 0;

    public onEnable(): void {
        this._mapLevel = appContext.userDataStorage.currentLevel;
        this.updateNum();
    }

    private updateNum(): void {
        this.levelNumber.level = this._mapLevel;
    }
}
