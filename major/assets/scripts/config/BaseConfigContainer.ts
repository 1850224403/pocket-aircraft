/*
 * @Author: Feifan Chen
 * @Date: 2019-11-11 18:50:50
 * @Description: 配置容器父类
 * @Last Modified by: Feifan Chen
 * @Last Modified time: 2019-11-11 18:51:40
 */
export abstract class BaseConfigContainer {

    protected _tag: any;
    public get tag(): any {
        return this._tag;
    }
    public set tag(value: any) {
        this._tag = value;
    }

}

export interface ConfigContainerClass<T extends BaseConfigContainer> {
    new(callback: Function, caller: any, arg:any): T;
}