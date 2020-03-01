import { RoleData } from "../data/RoleData";
import { NitrogenEnum } from "../const/NitrogenEnum";
import { ConstValue } from "../const/ConstValue";
import { AudioEnum } from "../const/AudioEnum";
import { EffectEnum } from "../const/EffectEnum";
import { EffectPosition } from "../const/EffectPosition";
import { LogUtil } from "../util/LogUtil";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-10 09:47:47 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-18 16:38:03
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Nitrogen extends cc.Component {

    private _timer: number = 0;

    private _data: RoleData = null;

    public bindData(data: RoleData): void {
        this._data = data;
    }

    public gainNitrogen(): void {
        this._data.nitrogen++;
    }

    public openNitrogen(type: NitrogenEnum): void {
        if (!this._data) return;

        let currentState = this._data.nitrogenState;
        switch (type) {
            case NitrogenEnum.LOW:
                // 只有待机状态才能使用小氮气
                if (currentState != NitrogenEnum.IDLE) return;
                this._timer = 0;
                this._data.nitrogenState = type;
                this._data.speed += this._data.lowNitrogenAddSpeed;
                this._data.speedIncrease++;
                if (this._data.isPlayer) {
                    gameContext.audioManager.playTempAudio(this._data, AudioEnum.LOW_NITROGEN);
                }
                break;

            case NitrogenEnum.HIGH:
                // 在待机和小氮气状态能使用大氮气
                if (currentState === NitrogenEnum.LOW) this._data.speedIncrease--;
                if (currentState === NitrogenEnum.HIGH) {
                    this._timer = 0;
                    break;
                }
                this._timer = 0;
                this._data.nitrogenState = type;
                this._data.speed += ConstValue.NITROGEN_SPEED_UP;
                this._data.speedIncrease += 20;
                if (this._data.isPlayer) {
                    gameContext.audioManager.playTempAudio(this._data, AudioEnum.HIGH_NITROGEN);
                }
                break;

            default:
                break;
        }
    }

    public update(dt: number): void {
        if (!this._data) return;

        this._timer += dt;

        let currentState = this._data.nitrogenState;
        switch (currentState) {
            case NitrogenEnum.LOW:
                if (this._timer > 1) {
                    this._data.speedIncrease--;
                    this._data.nitrogenState = NitrogenEnum.IDLE;
                }
                break;

            case NitrogenEnum.HIGH:
                if (this._timer > ConstValue.NITROGEN_INTERVAL) {
                    this._data.speedIncrease -= 20;
                    this._data.nitrogenState = NitrogenEnum.IDLE;
                }
                break;

            default:
                break;
        }
    }
}