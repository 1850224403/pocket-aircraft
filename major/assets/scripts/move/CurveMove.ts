import { BaseMove } from "./BaseMove";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-03-16 18:43:26 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-03-16 18:45:18
 */

export class CurveMove extends BaseMove {

    public moveWay(): cc.Action {
        let action = cc.bezierBy(1, [cc.v2(0, 0), cc.v2(-200, -200), cc.v2(-300, -1000)]);
        return action;
    }

}