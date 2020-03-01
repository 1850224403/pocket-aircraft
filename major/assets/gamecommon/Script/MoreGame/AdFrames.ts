import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";
import { ShareManager } from "../ShareCommon/ShareManager";
import { GameConfig } from "../GameCommon/GameCommon";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { ExportTypeEnum } from "../GameCommon/UserData";

/**
 * Created by 席庆功
 * Time: 2019/08/07.
 */
const {ccclass, property} = cc._decorator;

@ccclass
export class AdFrames extends cc.Component {

    @property({
        type: cc.Mask,
        displayName: "mask遮罩"
    })
    private mask: cc.Mask = null;

    @property({
        type: cc.Sprite,
        displayName: "图片"
    })
    protected currentSpriteConfig: cc.Sprite = null;

    @property({
        displayName: "展示间隔"
    })
    protected showInterval: number = 10;

    @property({
        displayName: "设计大小"
    })
    protected designSize: cc.Size = new cc.Size(90, 90);

    // 存放所有配置数据
    private static adFrames: Array<adFrame> = null;

    // 当前展示的配置index
    private currentIndex: number = null;

    // 当前展示的图片位置
    private currentPos: number = 0;

    // 当前展示的时间
    private currentShowTime: number = 0;

    // 每张图片展示间隔
    private spriteInterl: number = 0.13;

    public onLoad() {
        if (!ShareManager.getAdFramesControl()) {
            this.node.active = false;
            return;
        }

        if (!AdFrames.adFrames) {
            this.initConfig();
        }
    }

    public onEnable(): void {
        this.currentShowTime = null;
    }

    update(dt: number) : void {
        if (AdFrames.adFrames == null || AdFrames.adFrames.length <= 0) {
            return;
        }
        if (this.currentShowTime == null || this.currentShowTime > this.showInterval) {
            this.showNextAdFrame();
            return;
        }
        this.currentShowTime += dt;

        this.spriteInterl -= dt;
        if (this.spriteInterl <= 0) {
            this.refreAdFrame();
        }
    }

    private initConfig(): void {
        let finalUrl = ShareManager.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/assets/" + GameConfig.versionCode + "/adFramesConfig.txt?time=" + Date.now();

        GameCommonHttp.wxHttpGet(finalUrl, (retCode: number, retData: any) => {
            if (retCode != 0 || retData == null || retData.moreGames == null || retData.moreGames.length <= 0 || AdFrames.adFrames != null) {
                return;
            }

            AdFrames.adFrames = [];

            for (let adFrame of retData.moreGames) {
                if (adFrame != null && adFrame._jumpSwith) {
                    AdFrames.adFrames.push(adFrame);
                    GameCommonUtil.getTextureByUrl(adFrame._jumpImageUrl, (texture: cc.Texture2D) => {
                        if (texture == null) {
                            return;
                        }
                        adFrame.spriteFrame = new cc.SpriteFrame(texture);
                    });   
                }
            }
        });
    }

    private showNextAdFrame(): void {
        if (AdFrames.adFrames == null || AdFrames.adFrames.length <= 0) {
            return;
        }
        if (this.currentIndex == null) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = (this.currentIndex + 1) % AdFrames.adFrames.length;
        }
        let adFrame = AdFrames.adFrames[this.currentIndex];
        if (adFrame == null) {
            return;
        }

        let spriteFrame = adFrame.spriteFrame;
        if (spriteFrame == null) {
            return;
        }
        let oriSize = spriteFrame.getOriginalSize();
        if (oriSize == null) {
            return;
        }
        // 动态图固定为3*3
        let width = oriSize.width / 3;
        let height = oriSize.height / 3;
        this.currentSpriteConfig.spriteFrame = spriteFrame;
        this.currentSpriteConfig.node.width = oriSize.width;
        this.currentSpriteConfig.node.height = oriSize.height;
        this.mask.node.width = width;
        this.mask.node.height = height;
        this.mask.node.scale = Math.min(this.designSize.width / width, this.designSize.height, height);

        this.currentPos = 0;
        this.spriteInterl = 1 / (adFrame.dt * adFrame.len);
        this.currentShowTime = 0;
    }

    private refreAdFrame(): void {
        if (AdFrames.adFrames == null || AdFrames.adFrames.length <= 0 || this.currentIndex == null) {
            return;
        }
        let adFrame = AdFrames.adFrames[this.currentIndex];
        if (adFrame == null) {
            return;
        }

        let spriteFrame = adFrame.spriteFrame;
        if (spriteFrame == null) {
            return;
        }
        let oriSize = spriteFrame.getOriginalSize();
        if (oriSize == null) {
            return;
        }
        let cellWidth = oriSize.width / 3;
        let cellHeight = oriSize.height / 3;
        this.currentPos = (this.currentPos + 1) % adFrame.len;
        let y = Math.floor(this.currentPos / 3);
        this.currentSpriteConfig.node.position = cc.v2(cellWidth * (this.currentPos % 3), cellHeight * y).mul(-1);
        this.spriteInterl = 1 / (adFrame.dt * adFrame.len);
    }

    protected click(): void {
        let jumpAppId: string = "";
        let jumpPath: string = "";
        let jumpName: string = "";
        let self: AdFrames = this;
        if (AdFrames.adFrames == null || AdFrames.adFrames.length <= 0 || this.currentIndex == null) {
            return;
        }
        let adFrame = AdFrames.adFrames[this.currentIndex];
        if (adFrame == null) {
            return;
        }
        jumpAppId = adFrame._jumpAppId;
        jumpPath = adFrame._jumpPath;
        jumpName = adFrame._name;
        var QRCode = adFrame._QRCode;
        var switchQRCode =  adFrame._switchQRCode

        if (!jumpAppId) {
            return;
        }

        StatisticsManager.uploadJumpRecord(jumpAppId, jumpName, "playerClick", ExportTypeEnum.AD_FRAMES_MORE_GAME);
        window.gameCommon && window.gameCommon.getSDK.navigateToMiniProgram(jumpAppId, jumpPath, (success: boolean) => {
            self.showNextAdFrame();
            if (!success) {
                //跳转失败后判断是否需要二维码跳转
                if (switchQRCode) {
                    window.gameCommon.getSDK.previewImage(QRCode);
                }
                return;
            }
            StatisticsManager.uploadJumpRecord(jumpAppId, jumpName, "jumpSuccess", ExportTypeEnum.AD_FRAMES_MORE_GAME);
        });
    }
}

// 动态图固定为3*3
export class adFrame {
    _jumpSwith: boolean;//是否开启
    _jumpImageUrl: string;//src 动态广告图地址
    _name: string;
    _jumpAppId: string; //dst appid
    _jumpPath: string; //跳转到 dst 时携带的参数(包括路径)
    dt: number;//src  动态广告图帧频率/Hz
    len: number;// src 动态广告图帧长度
    _switchQRCode: boolean;//是否开启二维码跳转
    _QRCode: string; //src 二维码推广图
    spriteFrame: cc.SpriteFrame = null;
}
