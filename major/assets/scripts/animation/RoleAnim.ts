import { RoleData } from "../data/RoleData";
import { PrefabPathEnum } from "../const/ResPathEnum";
import { PoolEnum } from "../const/PoolEnum";
import { RoleAnimEnum } from "../const/RoleAnimEnum";
/*
 * @Author: FeiFan Chen 
 * @Date: 2019-12-28 17:14:57 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-04 00:53:00
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class RoleAnim extends cc.Component {

    @property({
        displayName: '动画',
        type: sp.Skeleton
    })
    private spineAnim: sp.Skeleton = null;

    private _roleData: RoleData = null;

    public bindData(data: RoleData): void {
        this._roleData = data;
    }
    public updateSelf(dt: number): void {
        if (!this._roleData) return;
        this.updateAnim();
    }

    public updateAnim(): void {
        let speed = this._roleData.speed;
        let maxSpeed = this._roleData.maxSpeed;
        let speedIncrease = this._roleData.speedIncrease;
        let moveUp = this._roleData.isMoveUp;
        let moveDown = this._roleData.isMoveDown;
        let isSpeedUp = this._roleData.isSpeedUp;
        let inGround = this._roleData.inGround;
        if (inGround && moveUp) {
            this.playAnim(RoleAnimEnum.BIAN_DAO_SHANG);
        } else if (inGround && moveDown) {
            this.playAnim(RoleAnimEnum.BIAN_DAO_XIA);
        } else if (speedIncrease > 0) {
            this.playAnim(RoleAnimEnum.JIA_SU_YI_DONG);
        } else if (speed <= 0) {
            this.playAnim(RoleAnimEnum.DAI_JI);
        } else if (speed >= maxSpeed) {
            this.playAnim(RoleAnimEnum.QI_DONG_2);
        } else if (isSpeedUp) {
            this.playAnim(RoleAnimEnum.QI_DONG_1);
        } else {
            this.playAnim(RoleAnimEnum.YI_DONG);
        }
    }

    public playAnim(anim: RoleAnimEnum): void {
        if (this.spineAnim.animation === anim) return;
        switch (anim) {
            case RoleAnimEnum.DAI_JI:
                this.spineAnim.setAnimation(0, anim, true);
                this.spineAnim.timeScale = 0.6;
                this.spineAnim.setCompleteListener(null);
                break;

            case RoleAnimEnum.QI_DONG_1:
                this.spineAnim.setAnimation(0, anim, false);
                this.spineAnim.timeScale = 1;
                this.spineAnim.setCompleteListener(null);
                break;

            case RoleAnimEnum.QI_DONG_2:
                if (this.spineAnim.animation === RoleAnimEnum.YI_DONG) return;
                this.spineAnim.setAnimation(0, anim, false);
                this.spineAnim.timeScale = 1;
                this.spineAnim.setCompleteListener(() => this.playAnim(RoleAnimEnum.YI_DONG));
                break;

            case RoleAnimEnum.YI_DONG:
                this.spineAnim.setAnimation(0, anim, true);
                this.spineAnim.timeScale = 1;
                this.spineAnim.setCompleteListener(null);
                break;

            case RoleAnimEnum.BIAN_DAO_SHANG:
                this.spineAnim.setAnimation(0, anim, false);
                this.spineAnim.timeScale = 1;
                this.spineAnim.setCompleteListener(null);
                break;

            case RoleAnimEnum.BIAN_DAO_XIA:
                this.spineAnim.setAnimation(0, anim, false);
                this.spineAnim.timeScale = 1;
                this.spineAnim.setCompleteListener(null);
                break;

            case RoleAnimEnum.JIA_SU_YI_DONG:
                this.spineAnim.setAnimation(0, anim, false);
                this.spineAnim.timeScale = 1;
                this.spineAnim.setCompleteListener(null);
                break;

            default:
                break;
        }
    }

    public explosion(): void {
        let explosionPrefab = appContext.resourcesManager.getPrefab(PrefabPathEnum.EXPLOSION);
        if (!explosionPrefab) return;
        let explosionNode = appContext.poolManager.get(PoolEnum.EXPLOSION, explosionPrefab);
        if (!explosionNode) return;
        explosionNode.parent = this.node;
        explosionNode.position = cc.v2(0, 40);
    }

    public playReliveAnim(): void {
        this.node.opacity = 255;

        let action = cc.sequence(
            cc.fadeOut(0.5),
            cc.fadeIn(0.5)
        ).repeat(3);

        this.node.runAction(action);
    }

}