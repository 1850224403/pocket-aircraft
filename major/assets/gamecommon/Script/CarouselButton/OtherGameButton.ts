import { CarouseRotate } from "./CarouseRotate";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { ExportTypeEnum } from "../GameCommon/UserData";

const { ccclass, property } = cc._decorator;

enum CarouselButtonType {
    More = 0,
}

@ccclass
export class OtherGameButton extends cc.Component {
    @property({
        type: cc.Enum(CarouselButtonType)
    })
    protected moreBtnType: CarouselButtonType = CarouselButtonType.More;

    @property(cc.Sprite)
    protected currentSpriteConfig: cc.Sprite = null;

    @property([cc.Integer])
    protected hideLevel: number[] = new Array();

    public get currentSprite(): cc.Sprite {
        return this.currentSpriteConfig;
    }

    @property(CarouseRotate)
    protected rotate: CarouseRotate = null;
    @property(cc.Float)
    protected switchTime: number = 15;

    @property(cc.Label)
    protected gameName: cc.Label = null;

    protected static _configJsonData: any = null;

    protected static _spriteUrlArr: string[] = [];

    protected static _spriteArr: cc.SpriteFrame[] = [];

    protected _dataIsLoad: boolean = false;

    protected _isSettingSprite: boolean = false;

    protected _currentTime: number = 0;

    protected _isLoading: boolean = false;

    private data: any = null;

    private clickAction: any = null;

    public bindData(data: any, clickAction: any): void {
        if (!data) {
            return;
        }
        this.data = data;
        this.clickAction = clickAction;

        let url = data._jumpImageUrl;
        //下载图片
        this.setSpriteFrame(url);
        //设置名字
        let jumpName: string = data._name;
        if (jumpName != null) {
            this.gameName.string = jumpName;
        }

    }

    private static spriteDic: Map<string, cc.SpriteFrame> = new Map();

    protected setSpriteFrame(url: string): void {
        if (!url || url.length < 3) {
            return;
        }

        if (OtherGameButton.spriteDic.has(url)) {
            this.currentSpriteConfig.spriteFrame = OtherGameButton.spriteDic.get(url);
        }
        else {
            let self = this;
            GameCommonUtil.getTextureByUrl(url, (texture: cc.Texture2D) => {
                if (texture == null) {
                    return;
                }
                let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(texture);
                if (spriteFrame != null) {
                    self.currentSpriteConfig.spriteFrame = spriteFrame;
                    OtherGameButton.spriteDic.set(url, spriteFrame);
                }
            });
        }
    }

    protected click(): void {

        if (!this.data) {
            return;
        }
        let jumpAppId: string = "";
        let jumpPath: string = "";
        let jumpName: string = "";
        let self: OtherGameButton = this;

        jumpAppId = this.data._jumpAppId;
        jumpPath = this.data._jumpPath;
        jumpName = this.data._name;
        var QRCode = this.data._QRCode;
        var switchQRCode = this.data._switchQRCode;

        if (!jumpAppId) {
            return;
        }
        self._currentTime = 0;
        StatisticsManager.uploadJumpRecord(jumpAppId, jumpName, "playerClick", ExportTypeEnum.CAROUSEL_BUTTON);
        window.gameCommon.getSDK.navigateToMiniProgram(jumpAppId, jumpPath, (success: boolean) => {
            self.clickAction && self.clickAction();
            if (!success) {
                //跳转失败后判断是否需要二维码跳转
                if (switchQRCode) {
                    window.gameCommon.getSDK.previewImage(QRCode);
                }
                return;
            }
            StatisticsManager.uploadJumpRecord(jumpAppId, jumpName, "jumpSuccess", ExportTypeEnum.CAROUSEL_BUTTON);
        });
    }
}
