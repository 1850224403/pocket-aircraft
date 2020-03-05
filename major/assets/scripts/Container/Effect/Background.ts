/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-03-06 00:03:14 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-06 00:09:27
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class Background extends cc.Component {

    public updateSelf(dt: number): void {
        this.node.y -= 5;
    }

}
