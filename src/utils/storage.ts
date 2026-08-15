// Storage 工具类，用于封装 localStorage 操作
export const Storage = {
  /**
   * 从 localStorage 获取数据
   * @param key 键名
   * @param defaultValue 默认值，当获取失败或解析失败时返回
   * @returns 获取到的值或默认值
   */

  // <T> 表示让调用方来指定类型,确保存进去的和取出来的类型一致
  get<T>(key: string, defaultValue: T): T {
    // 防止在 SSR 环境下报错
    if (typeof window === 'undefined') {
      return defaultValue
    }
    //try-catch 用来防止localStorage被禁用或数据损坏时候整个页面白屏
    try {
      const item = localStorage.getItem(key) //key是键名，item是键值
      // 如果 item 为 null 或 undefined，则返回默认值
      if (item === null || item === undefined) {
        return defaultValue
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.warn(`读取存储键"${key}"时出错`, error)
      return defaultValue
    }
  },

  /**
   * 设置 localStorage 数据
   * @param key 键名
   * @param value 要存储的值
   */
  set<T>(key: string, value: T): void {
    // 防止在 SSR 环境下报错
    if (typeof window === 'undefined') {
      return
    }

    try {
      // 将值转换为 JSON 字符串并存储到 localStorage
      //之所以能存数组，是因为 JSON.stringify 完美支持数组。
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // 如果储存空间满了就会报错
      console.warn(`写入存储键"${key}"时出错`, error)
    }
  },
}
