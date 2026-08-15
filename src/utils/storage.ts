// Storage 工具类，用于封装 localStorage 操作
export const Storage = {
  /**
   * 从 localStorage 获取数据
   * @param key 键名
   * @param defaultValue 默认值，当获取失败或解析失败时返回
   * @returns 获取到的值或默认值
   */
  get<T>(key: string, defaultValue: T): T {
    // 防止在 SSR 环境下报错
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null|| item === undefined) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`读取存储键"${key}"时出错`, error);
      return defaultValue;
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
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }
};
