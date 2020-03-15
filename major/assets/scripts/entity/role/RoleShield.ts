import { RoleAnim } from "../../animation/RoleAnim";

/*
 * @Author: XiongZhiCheng 
 * @Date: 2020-02-17 18:56:55 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-17 19:23:22
 */

const { ccclass, property } = cc._decorator;

const INVINCIBLE_INTERVAL: number = 3;

@ccclass
export class RoleShield extends cc.Component {

    public onEnable(): void {
        this.node.stopAllActions();
        this.playAction();
    }

    public playAction(): void {
        this.node.opacity = 255;
        this.node.rotation = 0;
        let action = cc.spawn(
            cc.sequence(
                cc.fadeOut(1),
                cc.fadeIn(1)
            ).repeat(3),
            cc.rotateBy(INVINCIBLE_INTERVAL, 360));
        this.node.runAction(action);
    }
}
