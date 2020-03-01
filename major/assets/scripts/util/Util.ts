/*
 * @Author: Feifan Chen 
 * @Date: 2019-07-02 09:08:42 
 * @Description: 工具类 
 * @Last Modified by: FeiFan Chen
 * @Last Modified time: 2020-01-04 14:06:56
 */
export class Util extends cc.Component {

    /**
     * 从向量获取角度
     * @param v 向量
     */
    public static getAngleFromVector(v: cc.Vec2): number {
        let radian = v.signAngle(cc.Vec2.RIGHT.clone());
        let angle = -((radian * 180) / Math.PI);
        return angle;
    }

    /**
     * 获取随机浮点数
     * @param min 最小值
     * @param max 最大值
     */
    public static getRandomFloat(min: number, max: number): number {
        return min + (Math.random() * (max - min));
    }

    /**
     * 获取随机整数
     * @param min 最小值
     * @param max 最大值
     */
    public static getRandomInt(min: number, max: number): number {
        return Math.floor(this.getRandomFloat(min, max));
    }

    /**
    * 判断属性是否合法有效
    * @param property 属性 
    */
    public static propertyIsValid(property: any): boolean {
        return typeof property != 'undefined' &&
            property != null;
    }

    /** 获取节点世界坐标 */
    public static getWorldPos(node: cc.Node): cc.Vec2 {
        return node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }

    /**
     * 异步等待一段时间
     * @param time 时间秒
     */
    public static timeout(time: number): Promise<unknown> {
        return new Promise(resolve => setTimeout(resolve, time * 1000));
    }

    /**
     * 加载单个资源
     * @param path 路径
     * @param type 类型
     */
    public static loadRes<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, type, (err, resource) => {
                if (err) {
                    reject();
                } else {
                    resolve(resource);
                }
            })
        });
    }

    /**
     * 创建一个节点
     */
    public static createComp(parent: cc.Node, name: string, type: any = null): any {
        if (!parent) {
            return;
        }

        let node = new cc.Node();
        node.name = name;
        node.setParent(parent);
        if (type) {
            return node.addComponent(type);
        }
    }
}