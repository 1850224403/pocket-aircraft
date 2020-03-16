import { BaseMove } from "./BaseMove";

/*
 * @Author: zhicheng xiong 
 * @Date: 2020-03-16 16:47:28 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-17 07:13:15
 */

export class HorizontalMove extends BaseMove {

    public moveWay(): cc.Action {
        let action = cc.moveBy(5, cc.v2(1000, 0));
        return action;
    }

}