import { ImageNumber } from "../../entity/ImageNumber";

/*
 * @Author: chenfeifan 
 * @Date: 2020-02-14 16:27:26 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-14 19:10:35
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoundCounter extends cc.Component {

    @property({
        displayName: '当前圈数',
        type: ImageNumber
    })
    private currentRound: ImageNumber = null;

    @property({
        displayName: '总圈数',
        type: ImageNumber
    })
    private totalRound: ImageNumber = null;

    private _currentRound: number = 1;

    private _totalRound: number = 1;

    public init(): void {
        let levelData = gameContext.battleData.levelData;
        if (!levelData) {
            return;
        }
        this._currentRound = 1;
        this._totalRound = levelData.roundCount;
        this.refreshRoundShow();
    }

    public update(dt: number): void {
        let battleData = gameContext.battleData;
        let playerData = battleData.playerData;
        if (!playerData) return;
        let playerX = playerData.pos.x;
        let cr = gameContext.mapManager.getRoundCount(playerX);
        if (cr != this._currentRound) {
            this._currentRound = cr;
            this.refreshRoundShow();
        }
    }

    private refreshRoundShow(): void {
        this.currentRound.value = this._currentRound;
        this.totalRound.value = this._totalRound;
    }

}
