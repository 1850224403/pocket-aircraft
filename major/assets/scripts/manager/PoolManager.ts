/*
 * @Author: Feifan Chen 
 * @Date: 2019-11-12 14:58:38 
 * @Description: 对象池管理 
 * @Last Modified by: Feifan Chen
 * @Last Modified time: 2019-11-15 14:35:00
 */
export class PoolManager {

    private poolMap: Map<string, cc.NodePool> = new Map();

    /** 添加进入池 */
    public add(type: string, node: cc.Node): void {
        if (!this.poolMap.has(type)) {
            let pool = new cc.NodePool();
            this.poolMap.set(type, pool);
        }
        this.poolMap.get(type).put(node);
    }

    /** 获取池对象 */
    public get(type: string, prefab: cc.Prefab): cc.Node {
        if (!this.poolMap.has(type)) {
            let pool = new cc.NodePool();
            this.poolMap.set(type, pool);
        }
        let node = this.poolMap.get(type).get();
        if (!node) {
            node = cc.instantiate(prefab);
        }
        return node;
    }

    public getWithoutPrefab(type: string): cc.Node {
        if (!this.poolMap.has(type)) {
            let pool = new cc.NodePool();
            this.poolMap.set(type, pool);
        }
        let node = this.poolMap.get(type).get();
        return node;
    }

}