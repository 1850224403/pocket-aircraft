/*
 * @Author: Feifan Chen 
 * @Date: 2019-05-11 14:12:03 
 * @Description: 帧动画
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-21 17:06:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Anim/Frame')
export class FrameAnim extends cc.Component {

    @property({
        displayName: "默认播放"
    })
    private defaultPlay: boolean = false;

    @property({
        displayName: "是否重复播放"
    })
    private forever: boolean = false;

    @property({
        displayName: "自动销毁"
    })
    private autoDestory: boolean = false;

    @property({
        displayName: '对象池key'
    })
    private poolKey: string = '';

    @property({
        displayName: "图片组件",
        type: cc.Sprite
    })
    private sprite: cc.Sprite = null;

    @property({
        displayName: "帧间隔",
        type: cc.Float
    })
    private frameInterval: number = 0.2;

    @property({
        displayName: "动画帧",
        type: [cc.SpriteFrame]
    })
    private spriteFrames: cc.SpriteFrame[] = [];

    public setFrames(frames: cc.SpriteFrame[]): void {
        this.spriteFrames = frames;
    }

    private index: number = 0;

    private animing: boolean = false;

    private callback: () => void = null;

    public onEnable(): void {
        this.sprite.spriteFrame = null;
        if (!this.defaultPlay) {
            return;
        }
        this.play();
    }

    /**
     * 播放帧动画
     */
    public play(): void {
        if (this.animing) {
            return;
        }
        this.animing = true;

        this.index = 0;
        this.sprite.spriteFrame = this.spriteFrames[this.index];
        let self = this;

        this.callback = () => {
            self.index++;
            self.sprite.spriteFrame = self.spriteFrames[self.index];
            if (self.index >= self.spriteFrames.length - 1) {
                self.index = -1;
                if (self.forever) {
                    return;
                }
                self.reset();
            }
        }

        this.schedule(this.callback, this.frameInterval, cc.macro.REPEAT_FOREVER);
    }

    public reset(): void {
        this.index = 0;
        this.animing = false;

        if (this.callback) {
            this.unschedule(this.callback);
            this.callback = null;
        }
        this.sprite.spriteFrame = null;

        if (this.autoDestory) {
            if (this.poolKey.length) {
                appContext.poolManager.add(this.poolKey, this.node);
            } else {
                this.node.destroy();
            }
        }
    }

}