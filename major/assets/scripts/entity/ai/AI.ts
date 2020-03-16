import { Role } from "../role/Role";
import { AILevelEnum } from "../../const/AILevelEnum";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-03 16:14:41 
 * @Last Modified by: chenfeifan
 * @Last Modified time: 2020-02-12 19:26:08
 */
const { ccclass, property } = cc._decorator;

@ccclass
export abstract class AI {

    protected _level: AILevelEnum = AILevelEnum.LOW;

    public bindData(aiLevel: AILevelEnum, role: Role, delay: number): void {
        this._level = aiLevel;

    }

    private initChasingAI(): void {
        switch (this._level) {
            case AILevelEnum.LOW:
            case AILevelEnum.MIDDLE:
                break;

            case AILevelEnum.HIGH:
                break;

            default:
                break;
        }
    }

    public updateSelf(dt: number): void {
    }

}