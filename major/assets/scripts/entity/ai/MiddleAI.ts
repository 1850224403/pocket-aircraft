import { AI } from "./AI";
import { AIActionEnum } from "../../const/AIActionEnum";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-14 14:56:26 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-19 16:57:10
 */
export class MiddleAI extends AI {

    private _moveSpeed: number = 10;

    private _action: AIActionEnum = AIActionEnum.MOVE_FRONT;

    public updateSelf(dt: number): void {
        super.updateSelf(dt);
        if (!this._role || !this._isStarting) return;

        this._actionTimer += dt;
        if (this._actionTimer > this._actionDelay) {
            this.nextAction();
        }

        // 执行动作
        this.runAction(dt);

        // 检查是否需要追逐
        this.checkLeftPlayer();
    }

    private nextAction(): void {
        this._actionTimer = 0;
        this._actionDelay = Util.getRandomFloat(5, 10);
        let random = Math.random();
        if (random < 1 / 3) {
            this._action = AIActionEnum.MOVE_UP;
        } else if (random < 2 / 3) {
            this._action = AIActionEnum.MOVE_FRONT;
        } else {
            this._action = AIActionEnum.MOVE_DOWN;
        }
    }

    private runAction(dt: number): void {
        switch (this._action) {
            case AIActionEnum.MOVE_UP:
                this._role.move(this._moveSpeed * dt);
                break;

            case AIActionEnum.MOVE_FRONT:
                this._role.move(0);
                //...
                break;

            case AIActionEnum.MOVE_DOWN:
                this._role.move(-this._moveSpeed * dt);
                break;

            default:
                break;
        }
    }

}