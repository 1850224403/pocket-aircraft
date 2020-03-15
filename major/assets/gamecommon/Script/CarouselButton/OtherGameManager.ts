import { OtherGameButton } from "./OtherGameButton";
import { ShareManager } from "../ShareCommon/ShareManager";
import { GameConfig } from "../GameCommon/GameCommon";
import { UserData, ExportTypeEnum } from "../GameCommon/UserData";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";

const { ccclass, property } = cc._decorator;

@ccclass
export class OtherGameManager extends cc.Component {

    protected static _configJsonData: any = null;

    protected static _dataIsLoad: boolean = false;

    protected _currentTime: number = 0;
    protected switchTime: number = 5;

    protected static _isLoading: boolean = false;

    @property([OtherGameButton])
    private buttons: OtherGameButton[] = [];

    public onLoad(): void {
        let url: string = ShareManager.cdnFileUrl + "/game-common/" + GameConfig.wxAppName + "/assets/" + GameConfig.versionCode + "/carouselButtonConfig.json";
        this.setConfigJsonData(url);
    }

    protected onEnable(): void {
        if (!ShareManager.getCarouseControl()) {
            this.node.active = false;
            return;
        }

        UserData.addModuleShows(ExportTypeEnum.CAROUSEL_BUTTON, 1);
    }

    protected setConfigJsonData(url: string): void {
        if (OtherGameManager._dataIsLoad) {
            this.initIcons();
            return;
        }
        let self = this;
        GameCommonHttp.wxHttpGet(url, (retCode: number, retData: any) => {
            if (retCode != 0 || retData == null || retData.moreConfig == null) {
                return;
            }

            OtherGameManager._configJsonData = retData.moreConfig;

            if (OtherGameManager._configJsonData._jumpSwith) {
                this.node.active = true;
            } else {
                return;
            }
            OtherGameManager._configJsonData = OtherGameManager._configJsonData.array;
            OtherGameManager._dataIsLoad = true;
            self.initIcons();
        });
    }

    public update(dt: number): void {
        if (!OtherGameManager._configJsonData) {
            return;
        }

        this._currentTime += dt;
        if (this._currentTime >= this.switchTime) {
            this.refresh();
        }
    }

    public initIcons(): void {
        if (!OtherGameManager._configJsonData) {
            return;
        }

        //清空男性数据
        this.filterArrayByGender(OtherGameManager._configJsonData);
        //乱序数组
        this.mixArrayIndex(OtherGameManager._configJsonData);
        //设置icon和回调
        for (let i = 0; i < this.buttons.length; i++) {
            if (i <= OtherGameManager._configJsonData.length) {
                this.buttons[i].bindData(OtherGameManager._configJsonData[i], this.refresh.bind(this));
                //this.buttons[i].show();
            }
            else {
                this.buttons[i].node.active = false;
            }
        }
    }

    private refresh(): void {
        this.initIcons();
        this._currentTime = 0;
    }

    private filterArrayByGender(array: any[]): any[] {
        if (!array || UserData.data.gender == 1) {
            return array;
        }
        for (let i = 0; i < array.length; i++) {
            let data = array[i];
            if (data && data.boyGame) {
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    }

    private mixArrayIndex(array: []): [] {
        if (!array || array.length < 2) {
            return;
        }
        for (let i = 0; i < array.length; i++) {
            let index = Math.floor(Math.random() * array.length);
            let temp = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
    }
}
