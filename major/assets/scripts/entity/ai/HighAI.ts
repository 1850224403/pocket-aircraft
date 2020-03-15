import { AI } from "./AI";
import { AIActionEnum } from "../../const/AIActionEnum";
import { Util } from "../../util/Util";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-14 15:33:22 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-19 16:56:58
 */
export class HighAI extends AI {

    private _moveSpeed: number = 35;

    private _frontItemPos: cc.Vec2 = null;

    private _frontBlockPos: cc.Vec2 = null;

    private _action: AIActionEnum = AIActionEnum.MOVE_FRONT;

    public updateSelf(dt: number): void {
        super.updateSelf(dt);
        if (!this._role || !this._isStarting) return;

        // 检测前方道具
        this.checkFront(dt);

        // 检查是否需要追逐
        this.checkLeftPlayer();
    }

    private checkFront(dt: number): void {
        let roleData = this._role.data;
        if (!roleData) return;
        let x = roleData.pos.x;
        this._frontBlockPos = gameContext.mapManager.getFrontBlock(x);
        this._frontItemPos = gameContext.mapManager.getFrontItem(x);
        let frontLimit = 350;
        let nearBlock = this._frontBlockPos && (this._frontBlockPos.x - roleData.pos.x) < frontLimit;
        let nearItem = this._frontItemPos && (this._frontItemPos.x - roleData.pos.x) < frontLimit;
        if (nearBlock && nearItem) {
            this.avoidBlock(dt);
            this._actionTimer = 0;
            this._action = AIActionEnum.MOVE_FRONT;
        } else if (nearBlock) {
            this.avoidBlock(dt);
            this._actionTimer = 0;
            this._action = AIActionEnum.MOVE_FRONT;
        } else if (nearItem) {
            this.eatItem(dt);
            this._actionTimer = 0;
            this._action = AIActionEnum.MOVE_FRONT;
        } else {
            this._actionTimer += dt;
            if (this._actionTimer > this._actionDelay) {
                this.nextAction();
            }
            this.runAction(dt);
        }
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
                break;

            case AIActionEnum.MOVE_DOWN:
                this._role.move(-this._moveSpeed * dt);
                break;

            default:
                break;
        }
    }

    private avoidBlock(dt: number): void {
        let roadOffset = 68;
        let roleData = this._role.data;
        let moveValue = this._moveSpeed * dt;
        if (Math.abs(roleData.roadY - this._frontBlockPos.y) > roadOffset) {
            return;
        }
        if (this._frontBlockPos.y > roleData.roadY) {
            // 障碍在玩家上面
            if (this._frontBlockPos.y > 33) {
                // 下边界限制
                this._role.move(-moveValue);
            } else {
                this._role.move(moveValue);
            }
        } else {
            // 障碍在玩家上面
            if (this._frontBlockPos.y < 238) {
                // 上边界限制
                this._role.move(moveValue);
            } else {
                this._role.move(-moveValue);
            }
        }
    }

    private eatItem(dt: number): void {
        let roleData = this._role.data;
        let moveValue = this._moveSpeed * dt;
        let offset = Math.abs(roleData.roadY - this._frontItemPos.y);
        if (offset <= moveValue) {
            return;
        }
        if (roleData.roadY > this._frontItemPos.y) {
            this._role.move(-moveValue);
        } else if (roleData.roadY < this._frontItemPos.y) {
            this._role.move(moveValue);
        }
    }

}
