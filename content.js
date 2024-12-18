/**
 * 代理状态管理模块
 */

// 代理状态管理
class ProxyManager {
  constructor() {
    this.enabled = false;
    this.init();
  }

  // 初始化代理状态
  async init() {
    try {
      this.enabled = await this.getStatus();
      this.log('Initialized');
    } catch (err) {
      this.error('Initialization failed', err);
    }
  }

  // 获取代理状态
  async getStatus() {
    return new Promise(resolve => {
      chrome.storage.local.get('proxyEnabled', ({ proxyEnabled = false }) => {
        resolve(proxyEnabled);
      });
    });
  }

  // 日志输出
  log(message) {
    console.log(`[Proxy] ${message}:`, this.enabled ? 'enabled' : 'disabled');
  }

  error(message, err) {
    console.error(`[Proxy Error] ${message}:`, err);
  }
}

// 创建代理管理器实例
const proxyManager = new ProxyManager();
