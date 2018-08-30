/**
 * Locals
 * version 0.0.1
 * @chenxinyao
 */

function localStorage() {
    return window.localStorage
}

function isJSON(str) {
    try {
        if (typeof JSON.parse(str) === 'object') {
            return true;
        }
    } catch (e) {
    }
    return false
}


class Locals {
    constructor() {
        // 获取所有localStorage存入store
        this.store = {
            ...localStorage()
        }
        this.currentKey = null
        this.nick = window.sessionStorage.getItem('PY_ZHU_LOGINUSER_NICK')
    }

    set(key, value) {
        this._setStore(key, value)
        // 正式环境下去掉warn
        console.warn(value, `SET localstorage for ${key} at ${new Date()} locals`)
        return this
    }

    get(...key) {
        const result = this._getStore(key)
        // 正式环境下去掉warn
        console.warn(result, `GET localstorage for ${key} at ${new Date()} locals`)
        return result
    }

    getAll() {
        const result = this.store
        // 正式环境下去掉warn
        console.warn(result, `GET All localstorage for ${key} at ${new Date()} locals`)
        return result
    }

    remove(...key) {
        const filterArr = key.filter(v => v && v in this.store)
        if (filterArr.length) {
            filterArr.forEach(key => {
                delete this.store[key]
                localStorage().removeItem(key)
            })
            // 正式环境下去掉warn
            console.warn(`REMOVE localstorage for ${key} at ${new Date()} locals`)
            return this.store
        } else {
            console.error(`REMOVE localStorage error in ${key} locals`)
        }
    }

    /**
     * 私有方法 外部不要使用
     * @param key
     * @param value
     * @private
     */
    _setStore(key, value) {
        const type = typeof value
        switch (type) {
            case 'string':
                this.store[key] = value
                this.currentKey = key
                localStorage().setItem(key, value)
                break
            case 'object':
                this.store[key] = value
                this.currentKey = key
                const values = JSON.stringify(value)
                localStorage().setItem(key, values)
                break
            default:
                console.error(`localStorage value type error in ${key} locals`, value)
                break
        }
    }

    /**
     * 私有方法 外部不要使用
     * @param key
     * @param value
     * @private
     */
    _getStore(key) {
        const filterArr = key.filter(v => v && v in this.store)
        if (filterArr.length) {
            try {
                const result = []
                filterArr.forEach(key => {
                    const storeData = typeof this.store[key] === 'string' ? this.store[key] : JSON.stringify(this.store[key])
                    const localData = localStorage().getItem(key)
                    if (storeData === localData) {
                        isJSON(localData) ? result.push(JSON.parse(localData)) : result.push(localData)
                    } else {
                        console.error(`localStorage does not exist in ${key} locals`)
                    }
                })
                return result.length === 1 ? result[0] : result
            } catch (e) {
                console.error(e, 'locals')
            }
        } else if (!key.length) {
            if (this.currentKey) return this.store[this.currentKey]
            console.error(`localStorage key error in ${key} locals`)
        } else {
            console.error(`localStorage key error in ${key} locals`)
        }
    }
}

export default Locals
