import { BaseMove } from "./BaseMove";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-03-17 09:58:58 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-03-17 10:04:29
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class BezierMove extends BaseMove {

    public moveWay(): cc.Action {
        let action = cc.bezierBy(5, [cc.v2(0, 0), cc.v2(-200, -200), cc.v2(-300, -1000)]);
        return action;
    }
}
