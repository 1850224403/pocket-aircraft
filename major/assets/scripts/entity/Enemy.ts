import { EnemyData } from "../data/EnemyData";
import { TagEnum } from "../const/TagEnum";

/*
 * @Author: FeiFan Chen 
 * @Date: 2020-01-19 16:55:30 
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-03-17 07:15:31
 */
const { ccclass, property } = cc._decorator;

const FIREDELAY = 0.2;

@ccclass
export class Enemy extends cc.Component {

    private _timer: number = 0;

    private _collider: cc.BoxCollider = null;

    private _data: EnemyData = null;
    public get data(): EnemyData {
        return this._data;
    }

    public onLoad(): void {
        this.createCollider();
        this.init();
    }

    public init(): void {
    }

    public createCollider(): void {
        this._collider = this.node.addComponent(cc.BoxCollider);
        this._collider.tag = TagEnum.ENEMY;
    }

    public bindData(data: EnemyData): void {
        if (!data) {
            return;
        }
        this._data = data;
        if (this._data.moveWay === 0) {
            this.node.rotation = -90;
        }
        this.move();
    }

    private move(): void {
        let action = gameContext.moveManager.getMoveWay(this._data.type);
        this.node.runAction(action);
    }

    public touchStart(): void {
    }

    public updateSelf(dt: number): void {
        // if (!this._data) return;
        // this.node.y -= 3;
    }

    private fire(): void {
        gameContext.bulletManager.createBullet(this.node.position);
    }

    public touchEnd(): void {
    }

    public destroySelf(): void {
        this.node.destroy();
    }
}
