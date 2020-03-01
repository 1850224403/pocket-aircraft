/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-10 16:14:26 
 * @Last Modified by: zhicheng xiong
 * @Last Modified time: 2020-01-10 16:35:54
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class MapProgressEffect extends cc.Component {

    public update(dt: number): void {
        this.node.x += 1;
        if (this.node.x > 300) {
            this.node.x = -60;
        }
    }
}
