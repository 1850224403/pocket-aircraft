/*
 * @Author: zhicheng xiong 
 * @Date: 2020-01-19 10:32:01 
 * @Last Modified by:   zhicheng xiong 
 * @Last Modified time: 2020-01-19 10:32:01 
 */

export enum UIType {

    /** 界面 */
    PANEL,

    /** 对话框 */
    DIALOG,

    /** 提示 */
    TIP

}

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class BaseUI extends cc.Component {

    @property({
        displayName: "界面类型",
        type: cc.Enum(UIType)
    })
    private uiType: UIType = UIType.PANEL;

    public getType(): UIType {
        return this.uiType;
    }

    protected _tag: any;
    public get tag(): any {
        return this._tag;
    }
    public set tag(value: any) {
        this._tag = value;
    }

    public abstract onShow(...args: any): void;

    public abstract onHide(): void;

}

export interface UIClass<T extends BaseUI> {
    new(): T;
    url: string;
}