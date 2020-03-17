/*
 * @Author: zhicheng xiong 
 * @Date: 2020-03-16 17:01:15 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-03-17 10:04:58
 */

import { HorizontalMove } from "./HorizontalMove";
import { VerticalMove } from "./VerticalMove";
import { BaseMove } from "./BaseMove";
import { BezierMove } from "./BezierMove";

export class MoveManager {

    private _move: BaseMove = null;

    private _horizontalMove: HorizontalMove = null;

    private _verticalMove: VerticalMove = null;

    private _bezierMove: BezierMove = null;

    public init(): void {
        this._horizontalMove = new HorizontalMove();
        this._verticalMove = new VerticalMove();
        this._bezierMove = new BezierMove();
    }

    public getMoveWay(enemyType: number): cc.Action {
        let action = null;

        switch (enemyType) {
            case 0:
            case 1:
                this._move = this._horizontalMove;
                break;

            case 3:
            case 4:
                this._move = this._verticalMove;
                break;

            case 5:
            case 6:
                this._move = this._verticalMove;
                break;
        }
        return this._move.moveWay();
    }
}
