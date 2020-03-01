import { BaseUI, UIClass, UIType } from "../ui/BaseUI";
import { ZOrderEnum } from "../const/ZOrderEnum";
import { NodeNameEnum } from "../const/NodeNameEnum";
import { GamePanel } from "../ui/panel/GamePanel";

/*
 * @Author: Feifan Chen
 * @Date: 2019-11-08 19:57:38
 * @Description: UI管理
 * @Last Modified by: XiongZhiCheng
 * @Last Modified time: 2020-02-19 11:13:28
 */
export class UIManager {

    private _uiRoot: cc.Node = null;

    private _uiList: BaseUI[] = [];

    private _currentPanel: BaseUI = null;
    public get currentPanel(): BaseUI {
        return this._currentPanel;
    }

    private _dialogCount: number = 0;

    private uiBlockPanel: cc.Node = null;

    constructor() {
        let canvas = cc.Canvas.instance.node;
        let uiRoot = canvas.getChildByName(NodeNameEnum.UI_ROOT);
        if (uiRoot) {
            this._uiRoot = uiRoot;
        } else {
            console.error('can not find ui root in canvas');
        }

        let tipContainer = canvas.getChildByName("Tip");
        tipContainer && (tipContainer.zIndex = ZOrderEnum.TIP);

        this.initUIBlockPanel();
    }

    private initUIBlockPanel(): void {
        let block = new cc.Node("UIBlockPanel").addComponent(cc.BlockInputEvents);
        this.uiBlockPanel = block.node;
        this.uiBlockPanel.zIndex = ZOrderEnum.BLOCK_INPUT;
    }

    private openUI<T extends BaseUI>(uiClass: UIClass<T>, openedCall: Function): void {
        let callback = (res: cc.Prefab) => {
            if (!res) {
                this.hideBlockPanel();
                return;
            }
            if (this.getUI(uiClass)) {
                this.hideBlockPanel();
                return;
            }
            let uiNode: cc.Node = cc.instantiate(res);
            uiNode.parent = this._uiRoot;
            let ui = uiNode.getComponent(uiClass) as BaseUI;
            ui.tag = uiClass;
            this._uiList.push(ui);
            openedCall && openedCall();
        }
        appContext.resourcesManager.loadPrefab(uiClass.url, callback);
    }

    /** 对对话框做了特殊处理 统一使用showUI hideUI 方法 */
    private closeUI<T extends BaseUI>(uiClass: UIClass<T>): void {
        for (let i = 0; i < this._uiList.length; ++i) {
            if (this._uiList[i].tag === uiClass) {
                this._uiList[i].node.destroy();
                this._uiList.splice(i, 1);
                return;
            }
        }
    }

    public showUI<T extends BaseUI>(uiClass: UIClass<T>, callback?: Function, ...args: any[]): void {
        if (!this._uiRoot) {
            console.error('ui root is null');
            return;
        }
        this.showBlockPanel();
        let ui = this.getUI(uiClass);
        if (ui) {
            ui.node.active = true;
            callback && callback();
            ui.onShow(...args);
            this.checkShowUI(ui);
            this.hideBlockPanel();
        } else {
            this.openUI(uiClass, () => {
                callback && callback();
                ui = this.getUI(uiClass);
                ui && ui.onShow(...args);
                this.checkShowUI(ui);
                this.hideBlockPanel();
            });
        }
    }

    public hideUI<T extends BaseUI>(uiClass: UIClass<T>): void {
        let ui = this.getUI(uiClass);
        if (ui && ui.node && ui.node.active) {
            ui.onHide();
            ui.node.active = false;
            this.checkHideUI(ui);
        }
    }

    private showBlockPanel(): void {
        this.uiBlockPanel.active = true;
    }

    private hideBlockPanel(): void {
        this.uiBlockPanel.active = false;
    }

    public getUI<T extends BaseUI>(uiClass: UIClass<T>): BaseUI {
        for (let i = 0; i < this._uiList.length; ++i) {
            if (this._uiList[i].tag === uiClass) {
                return this._uiList[i];
            }
        }
        return null;
    }

    private checkShowUI(ui: BaseUI): void {
        if (!ui) return;
        let type = ui.getType();
        switch (type) {
            case UIType.PANEL:
                if (this._currentPanel && this._currentPanel != ui) {
                    this.hideUI(this._currentPanel.tag);
                }
                this._currentPanel = ui;
                ui.node.zIndex = ZOrderEnum.PANEL;
                break;

            case UIType.DIALOG:
                ui.node.zIndex = ZOrderEnum.DIALOG + this._dialogCount;
                this._dialogCount++;
                break;

            case UIType.TIP:
                ui.node.zIndex = ZOrderEnum.TIP;
                break;

            default:
                break;
        }
    }

    private checkHideUI(ui: BaseUI): void {
        if (!ui) return;
        let type = ui.getType();
        switch (type) {
            case UIType.DIALOG:
                this._dialogCount--;
                break;

            case UIType.PANEL:
            case UIType.TIP:
            default:
                break;
        }
    }

}