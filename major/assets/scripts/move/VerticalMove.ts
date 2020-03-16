import { BaseMove } from "./BaseMove";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-03-16 16:52:57 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-03-16 18:42:41
 */

export class VerticalMove extends BaseMove {

    public moveWay(): cc.Action {
        let action = cc.moveBy(1, cc.v2(0, 2000));
        return action;
    }

}