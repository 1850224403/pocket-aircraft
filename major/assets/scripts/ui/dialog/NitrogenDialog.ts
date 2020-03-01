import { BaseUI } from "../BaseUI";
import { PrefabPathEnum } from "../../const/ResPathEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export class NitrogenDialog extends BaseUI {

    @property({
        displayName: '玩家',
        type: cc.Node
    })
    private role: cc.Node = null;

    public static url: string = PrefabPathEnum.NITROGEN_DIALOG;

    public onShow(): void {
        gameContext.gameManager.gamePause();
        this.init();
        this.scheduleOnce(this.rotateRole, 0.3);
    }

    private init(): void {
        this.role.stopAllActions();
        this.role.position = cc.v2(-50, 140);
        this.role.rotation = 0;
    }

    private rotateRole(): void {
        let spawn = cc.spawn(
            cc.rotateBy(0.8, -360),
            cc.moveBy(0.8, cc.v2(100, 140))
        );
        this.role.runAction(spawn);
    }

    public onHide(): void {
        gameContext.gameManager.gameResume();
    }
}
