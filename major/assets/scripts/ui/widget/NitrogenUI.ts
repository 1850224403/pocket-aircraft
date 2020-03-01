/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-20 18:51:24 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-02-08 09:23:39
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class NitrogenUI extends cc.Component {

    @property({
        displayName: '进度条',
        type: cc.Sprite
    })
    private progress: cc.Sprite = null;

    @property({
        displayName: '氮气On',
        type: cc.Node
    })
    private nitrogenOn: cc.Node = null;

    @property({
        displayName: '氮气Off',
        type: cc.Node
    })
    private nitrogenOff: cc.Node = null;

    @property({
        displayName: '外边光',
        type: cc.Node
    })
    private borderLight: cc.Node = null;

    private _nitrogenOn: boolean = false;

    public start(): void {
        this.showNitrogenOff();
    }

    public update(dt: number): void {
        let playerData = gameContext.battleData.playerData;
        this.progress.fillRange = playerData.nitrogen / 100;
        if (!this._nitrogenOn && this.progress.fillRange >= 1) {
            this.showNitrogenOn();
        } else if (this._nitrogenOn && this.progress.fillRange < 1) {
            this.showNitrogenOff();
        }
    }

    public showNitrogenOn(): void {
        this._nitrogenOn = true;
        this.refreshShow();

        this.borderLight.stopAllActions();
        let action = cc.sequence(
            cc.spawn(
                cc.fadeOut(1),
                cc.scaleTo(1, 1.5)
            ),
            cc.callFunc(() => {
                this.borderLight.opacity = 255;
                this.borderLight.scale = 1;
            })
        ).repeatForever();
        this.borderLight.runAction(action);
    }

    public showNitrogenOff(): void {
        this._nitrogenOn = false;
        this.refreshShow();

        this.borderLight.stopAllActions();
    }

    private refreshShow(): void {
        this.nitrogenOn.active = this._nitrogenOn;
        this.nitrogenOff.active = !this._nitrogenOn;
    }

    private clickUseNitrogen(): void {
        let player = gameContext.roleManager.player;
        player && player.useRoleNitrogen();
    }

}